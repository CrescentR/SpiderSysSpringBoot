package com.multiSpider.entity;

import cn.hutool.core.date.DateTime;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

/**
 * 
 * @TableName spider_task
 */
@TableName(value ="spider_task",autoResultMap = true)
@Data
public class SpiderTask {
    /**
     * 
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 
     */
    private String name;

    /**
     * 
     */
    private String description;

    /**
     * 
     */
    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> keywords;


    /**
     * 
     */
    @TableField("max_pages")
    private Integer maxPages;

    /**
     * 
     */
    private Integer timeout;

    /**
     * 
     */
    private String status;

    /**
     * 
     */
    @TableField("created_at")
    private LocalDateTime createdAt;

    /**
     * 
     */
    @TableField("updated_at")
    private LocalDateTime updatedAt;


}