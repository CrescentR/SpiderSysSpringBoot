package com.multiSpider.service.impl;

import cn.hutool.core.util.RandomUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.multiSpider.common.result.CommonVo;
import com.multiSpider.common.util.RegexUtils;
import com.multiSpider.dto.login.ResetDTO;
import com.multiSpider.entity.User;
import com.multiSpider.mapper.UserMapper;
import com.multiSpider.service.login.LoginService;
import com.multiSpider.vo.login.LoginVo;
import com.wf.captcha.SpecCaptcha;
import com.multiSpider.common.contants.RedisConstant;
import com.multiSpider.dto.login.LoginDTO;
import com.multiSpider.common.exception.SpiderException;
import com.multiSpider.common.result.Result;
import com.multiSpider.common.result.ResultCodeEnum;
import com.multiSpider.common.util.JwtUtil;
import com.multiSpider.vo.login.CaptchaVo;
import jakarta.servlet.http.HttpSession;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static com.multiSpider.common.contants.RedisConstant.*;
import static com.multiSpider.common.result.ResultCodeEnum.*;


@Service
public class LoginServiceImpl extends ServiceImpl<UserMapper, User> implements LoginService {
    private final StringRedisTemplate stringredisTemplate;
    private final UserMapper userMapper;
    @Autowired
    public LoginServiceImpl(StringRedisTemplate stringredisTemplate,UserMapper userMapper) {
        this.stringredisTemplate = stringredisTemplate;
        this.userMapper = userMapper;
    }

    @Override
    public CaptchaVo getCaptcha() {
        SpecCaptcha specCaptcha = new SpecCaptcha(130, 48, 4);
        specCaptcha.setCharType(SpecCaptcha.TYPE_ONLY_NUMBER);
        String code=specCaptcha.text().toLowerCase();
        String key = RedisConstant.ADMIN_LOGIN_CAPTCHA_PREFIX + UUID.randomUUID();
        String img=specCaptcha.toBase64();
        stringredisTemplate.opsForValue().set(key, code, RedisConstant.ADMIN_LOGIN_CAPTCHA_TTL_SEC, TimeUnit.MINUTES);
        return new CaptchaVo(img, key);
    }
    @Override
    public Result sendCode(String phone, HttpSession session) {
        // 1.校验手机号
        if (RegexUtils.isPhoneInvalid(phone)) {
            // 2.如果不符合，返回错误信息
            return Result.fail(PHONE_FORMAT_ERROR.getCode(), PHONE_FORMAT_ERROR.getMessage());
        }
        // 3.符合，生成验证码
        String code = RandomUtil.randomNumbers(6);

        // 4.保存验证码到 session
        stringredisTemplate.opsForValue().set(LOGIN_CODE_KEY + phone, code, LOGIN_CODE_TTL, TimeUnit.MINUTES);

        // 5.发送验证码
        log.debug("发送短信验证码成功，验证码:"+ code);
        // 返回ok
        return Result.ok();
    }
    @Override
    public LoginVo login(LoginDTO loginDTO) {
        LoginVo loginVo=new LoginVo();
        if (!StringUtils.hasText(loginDTO.getCaptchaCode())){
            loginVo.setReturnMessage("图形验证码不能为空！");
            return loginVo;
        }
        String code=stringredisTemplate.opsForValue().get(loginDTO.getCaptchaKey());
        if (code==null){
            throw new SpiderException(ResultCodeEnum.ADMIN_CAPTCHA_CODE_ERROR);
        }
        if (!code.equals(loginDTO.getCaptchaCode().toLowerCase())){
            throw new SpiderException(ResultCodeEnum.ADMIN_CAPTCHA_CODE_ERROR);
        }
        String phoneCode=stringredisTemplate.opsForValue().get(LOGIN_CODE_KEY+loginDTO.getPhone());
        if(!loginDTO.getPhoneCode().equals(phoneCode)){
            throw new SpiderException(ResultCodeEnum.ADMIN_CODE_ERROR);
        }

        if(loginDTO.getPassword()==null){
            loginVo.setReturnMessage("密码不能为空！");
            return loginVo;
        }
        LambdaQueryWrapper<User> queryWrapper=new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getPhone, loginDTO.getPhone());
        User user=userMapper.selectOne(queryWrapper);
        if (user==null){
            throw new SpiderException(ResultCodeEnum.ADMIN_ACCOUNT_NOT_EXIST_ERROR);
        }
        if (!user.getPassword().equals(DigestUtils.md5Hex(loginDTO.getPassword()))){
            throw new SpiderException(ResultCodeEnum.ADMIN_PASSWORD_ERROR);
        }
        Long id=user.getId();
        String token=JwtUtil.createToken(user.getId(),user.getName());
        String username=loginDTO.getPhone();
        LoginVo loginVoFinal=new LoginVo();
        loginVoFinal.setUsername(username);
        loginVoFinal.setToken(token);
        loginVoFinal.setId(id);
        return loginVoFinal;
    }
    @Override
    public CommonVo resetPassword(ResetDTO resetDTO){
        CommonVo commonVo=new CommonVo();
        LambdaUpdateWrapper<User> updateWrapper=new LambdaUpdateWrapper<>();
        LambdaQueryWrapper<User> queryWrapper=new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getId, resetDTO.getId());
        User user=userMapper.selectOne(queryWrapper);
        String oldPassword=user.getPassword();
        if (!oldPassword.equals(DigestUtils.md5Hex(resetDTO.getCurrentPassword()))) {
            commonVo.setCode(ResultCodeEnum.ADMIN_CURRENT_PASSWORD_ERROR.getCode());
            commonVo.setMessage(ResultCodeEnum.ADMIN_CURRENT_PASSWORD_ERROR.getMessage());
            return commonVo;
        }
        updateWrapper.eq(User::getId, resetDTO.getId());
        updateWrapper.set(User::getPassword, DigestUtils.md5Hex(resetDTO.getNewPassword()));
        update(updateWrapper);
        commonVo.setCode(200);
        commonVo.setMessage("密码修改成功");
        return commonVo;
    }
}
