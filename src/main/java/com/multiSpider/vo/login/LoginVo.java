package com.multiSpider.vo.login;

import lombok.Data;

@Data
public class LoginVo {
    private Long id;
    private String username;
    private String token;
    private String returnMessage;
}
