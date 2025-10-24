package com.multiSpider.service.login;

import com.multiSpider.common.result.CommonVo;
import com.multiSpider.dto.login.LoginDTO;
import com.multiSpider.dto.login.ResetDTO;
import com.multiSpider.common.result.Result;
import com.multiSpider.vo.login.CaptchaVo;
import com.multiSpider.vo.login.LoginVo;
import jakarta.servlet.http.HttpSession;

public interface LoginService {
    CaptchaVo getCaptcha();
    Result sendCode(String phone, HttpSession session);
    LoginVo login(LoginDTO loginDTO);
    CommonVo resetPassword(ResetDTO resetDTO);
}
