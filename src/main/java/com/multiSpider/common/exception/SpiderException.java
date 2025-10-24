package com.multiSpider.common.exception;

import com.multiSpider.common.result.Result;
import com.multiSpider.common.result.ResultCodeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;

@EqualsAndHashCode(callSuper = true)
@Data
@Slf4j
public class SpiderException extends RuntimeException {

    private Integer code;

    public SpiderException(Integer code, String message){
        super(message);
        this.code=code;
    }

    public SpiderException(ResultCodeEnum resultCodeEnum){
        super(resultCodeEnum.getMessage());
        this.code=resultCodeEnum.getCode();
    }
    @ExceptionHandler(RuntimeException.class)
    public Result<String> handleRuntimeException(RuntimeException e) {
        log.error(e.toString(), e);
        return Result.fail(500,"服务器异常");
    }
}
