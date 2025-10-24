package com.multiSpider.entity;

import cn.hutool.core.date.DateTime;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;
import java.util.Date;
import lombok.Data;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.LocalDateTimeTypeHandler;

/**
 * 
 * @TableName spider_result
 */
@TableName(value ="spider_result")
@Data
public class SpiderResult {
    /**
     * 
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 
     */
    @TableField("task_id")
    private Integer taskId;

    private String keywords;
    /**
     * 
     */
    private String title;

    /**
     * 
     */
    private String url;

    /**
     * 
     */
    private String source;


    /**
     * 
     */
    // 全局配置或单字段注解
    @TableField(value = "date_time", jdbcType = JdbcType.TIMESTAMP, typeHandler = LocalDateTimeTypeHandler.class)
    private LocalDateTime dateTime;



}