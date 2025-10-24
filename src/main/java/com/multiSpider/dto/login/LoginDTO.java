package com.multiSpider.dto.login;

import lombok.Data;

@Data
public class LoginDTO {
    private String phone;
    private String password;
    private String phoneCode;
    private String captchaKey;
    private String captchaCode;
}


