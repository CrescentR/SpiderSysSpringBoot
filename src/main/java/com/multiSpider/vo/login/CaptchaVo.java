package com.multiSpider.vo.login;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CaptchaVo {

    private String image;

    private String key;
}
