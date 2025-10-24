package com.multiSpider.common.result;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    private Integer code;
    private String msg;
    private T data;
    private Long total;

    /**
     * 成功，不带数据
     */
    public static <T> Result<T> ok() {
        return new Result<>(200, "操作成功", null, null);
    }

    /**
     * 成功，带消息
     */
    public static <T> Result<T> ok(String message) {
        return new Result<>( 200, message, null, null);
    }
    /**
     * 成功，带数据
     */
    public static <T> Result<T> ok(T data) {
        return new Result<>(200, "操作成功", data, 1L);
    }
    /**
     * 成功，带数据和消息
     */
    public static <T> Result<T> ok(T data, String message) {
        return new Result<>( 200, message, data, null);
    }
    /**
     * 成功，专门用于返回分页数据
     * 这个方法解决了类型安全问题
     */
    public static <E> Result<List<E>> ok(List<E> data, Long total) {
        return new Result<>( 200, "查询成功", data, total);
    }
    public static <E> Result<List<E>> ok(String message,List<E> data, Long total) {
        return new Result<>( 200, message, data, total);
    }
    // --- 失败静态工厂方法 ---
    /**
     * 失败，使用默认错误消息
     */
    public static <T> Result<T> fail() {
        return new Result<>( 500, "操作失败", null, null);
    }
    /**
     * 失败，带自定义错误消息
     */
    public static <T> Result<T> fail(Integer code,String message) {
        return new Result<>( code, message, null, null);
    }
    public static <T> Result<T> fail(Integer code,T data) {
        return new Result<>( code, "操作失败", data, null);
    }

}
