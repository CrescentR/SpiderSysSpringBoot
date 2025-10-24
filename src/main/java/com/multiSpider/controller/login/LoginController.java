package com.multiSpider.controller.login;
import com.multiSpider.common.result.CommonVo;
import com.multiSpider.dto.login.LoginDTO;
import com.multiSpider.dto.login.ResetDTO;
import com.multiSpider.common.exception.SpiderException;
import com.multiSpider.common.result.Result;
import com.multiSpider.common.result.ResultCodeEnum;
import com.multiSpider.service.login.LoginService;
import com.multiSpider.vo.login.CaptchaVo;
import com.multiSpider.vo.login.LoginVo;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

import static com.multiSpider.common.result.ResultCodeEnum.ADMIN_NOT_NULL_PASSWORD;

@RestController
@RequestMapping("/admin")
public class LoginController {
    @Autowired
    private LoginService loginService;
    @PostMapping("/login")
    public Result<LoginVo> loginIn(@RequestBody LoginDTO loginDTO){
        LoginVo loginVo=loginService.login(loginDTO);
        if(loginVo.getReturnMessage()!=null){
            return Result.fail(ADMIN_NOT_NULL_PASSWORD.getCode(),ADMIN_NOT_NULL_PASSWORD.getMessage());
        }else{
            return Result.ok(loginVo);
        }


    }
    @PostMapping("/code")
    public Result sendCode(@RequestParam("phone") String phone, HttpSession session) {
        // 发送短信验证码并保存验证码
        return loginService.sendCode(phone, session);
    }
    @PostMapping("/login_captcha")
    public Result<CaptchaVo> captcha(){
        CaptchaVo captcha= loginService.getCaptcha();
        return Result.ok(captcha);
    }
    @PostMapping("/reset_password")
    public Result<Void> resetPassword(@RequestBody ResetDTO resetDTO){
        try {
            CommonVo commonVo=loginService.resetPassword(resetDTO);
            if (!Objects.equals(commonVo.getCode(), ResultCodeEnum.SUCCESS.getCode())){
                return Result.fail(commonVo.getCode(),commonVo.getMessage());
            }
        }catch (SpiderException e){
            return Result.fail(500,"服务器异常！");
        }
        return Result.ok();
    }
}
