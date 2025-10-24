package com.multiSpider.common.interceptor;

import com.multiSpider.common.exception.QuickStartException;
import com.multiSpider.common.result.ResultCodeEnum;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

public class jwt {
    private final static long tokenExpiration = 60*60*1000L;
    private final static String SECRET_KEY = "CY29Eb04RP2dasdaaNyQPxACH2jBNWFGn0ypMhc";
    private final static SecretKey tokenKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    public static String createToken(Long userId, String username) {

        return Jwts.builder()
                .setSubject("USER_INFO")
                .setExpiration(new Date(System.currentTimeMillis() + tokenExpiration))
                .claim("userId", userId)
                .claim("username", username)
                .setIssuedAt(new Date())
                .signWith(tokenKey)
                .compact();
    }

    public static Claims parseToken(String token) {

        if (token == null) {
            throw new QuickStartException(ResultCodeEnum.ADMIN_LOGIN_AUTH);
        }
        try {
            JwtParser jwtParser = Jwts.parserBuilder()
                    .setSigningKey(tokenKey)
                    .build();
            return jwtParser.parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e) {
            throw new QuickStartException(ResultCodeEnum.TOKEN_EXPIRED);
        } catch (JwtException e) {
            throw new QuickStartException(ResultCodeEnum.TOKEN_INVALID);
        }
    }

    public static void main(String[] args) {
        System.out.println(createToken(1L, "13888888888"));
    }
}
