package com.multiSpider;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.multiSpider.mapper")
public class MultiSpiderApplication {

    public static void main(String[] args) {
        SpringApplication.run(MultiSpiderApplication.class, args);
    }

}
