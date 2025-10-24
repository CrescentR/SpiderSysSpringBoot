package com.multiSpider.common.config;

import com.multiSpider.common.interceptor.LoginInterceptor;
import com.multiSpider.common.interceptor.RefreshTokenInterceptor;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class MvcConfig implements WebMvcConfigurer {
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 1. Token刷新拦截器 (Refresh Token Interceptor)
        // 这个拦截器应该处理所有请求，以便在用户登录后，每次操作都能刷新token的有效期。
        // 它的优先级应该最高。
        registry.addInterceptor(new RefreshTokenInterceptor(stringRedisTemplate))
                .addPathPatterns("/**") // 拦截所有请求
                .order(0); // 设置最高优先级
        // 2. 登录拦截器 (Login Interceptor)
        // 使用 "白名单" 模式，只拦截明确指定的、需要登录才能访问的路径。
        // 未在此处指定的路径将默认不进行登录校验。
        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns(
                        "/voucher-order/**", // 例如：下单秒杀券需要登录
                        "/user/me",           // 例如：查看个人信息需要登录
                        "/user/sign",         // 例如：用户签到需要登录
                        "/blog/like/**",      // 例如：点赞博客需要登录
                        "/follow/**",         // 例如：关注/取关用户需要登录
                        "/shop/rate/**"       // 示例：给商铺评分
                        // 在这里继续添加其他任何需要登录才能访问的路径...
                ).order(1); // 优先级低于Token刷新拦截器
    }
}
