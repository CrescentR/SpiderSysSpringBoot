package com.multiSpider.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.multiSpider.entity.User;
import com.multiSpider.mapper.UserMapper;
import com.multiSpider.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper,User> implements UserService {

}
