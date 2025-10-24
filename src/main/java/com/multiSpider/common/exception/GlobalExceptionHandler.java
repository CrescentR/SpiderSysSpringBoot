package com.multiSpider.common.exception;

import com.multiSpider.common.result.Result;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public Result handle(Exception e){
        e.printStackTrace();
        return Result.fail();
    }
    @ExceptionHandler(SpiderException.class)
    public Result handle(SpiderException e){
        String message=e.getMessage();
        e.printStackTrace();
        return Result.fail(500,"服务器异常！");
    }
}