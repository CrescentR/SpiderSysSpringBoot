package com.multiSpider.controller;

import com.multiSpider.entity.User;
import com.multiSpider.service.UserService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/User")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @RequestMapping("/query")
    public List<User> queryUser(){
        return userService.list();
    }
    @RequestMapping ("/insert")
    public List<User> insertUser(User user){
        userService.save(user);
        return userService.list();
    }
    @RequestMapping("/delete")
    public List<User> deleteUser(int id){
        userService.removeById(id);
        return userService.list();
    }
    @RequestMapping("/update")
    public List<User> updateUser(User user){
        userService.updateById(user);
        return userService.list();
    }
}
