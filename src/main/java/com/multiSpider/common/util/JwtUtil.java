package com.multiSpider.common.util;

import com.multiSpider.common.exception.SpiderException;
import com.multiSpider.common.result.ResultCodeEnum;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;


@Slf4j
@Component
public class JwtUtil {
    private final static long tokenExpiration = 60 * 60 * 1000L;
    private final static String SECRET_KEY = "shang_ting_room_jwt_secret_key_20240601_secure_string";
    private final static SecretKey tokenSignKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    public static String createToken(Long uerId,String username){
        String token = Jwts.builder()
                .setSubject("USER_INFO")
                .claim("userId",uerId)
                .claim("username",username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + tokenExpiration))
                .signWith(tokenSignKey)
                .compact();
        return token;
    }
    public static Claims parseToken(String token){
        if(token==null){
            throw new SpiderException(ResultCodeEnum.ADMIN_LOGIN_AUTH);
        }
        try{
            JwtParser jwtparser=Jwts.parserBuilder().setSigningKey(tokenSignKey).build();
            return jwtparser.parseClaimsJws(token).getBody();
        }catch (ExpiredJwtException e){
            throw new SpiderException(ResultCodeEnum.TOKEN_EXPIRED);
        }catch (JwtException e){
            throw new SpiderException(ResultCodeEnum.TOKEN_INVALID);
        }
    }
}