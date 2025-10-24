package com.multiSpider.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("spider_user")
public class User {
    @TableId(value = "id",type = IdType.AUTO)
    private Long id;
    @TableField("username")
    private String name;
    @TableField("phone")
    private String phone;
    @TableField("password")
    private String password;
    @TableField("email")
    private String email;
}
