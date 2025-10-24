package com.multiSpider.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.multiSpider.entity.SpiderTask;
import com.multiSpider.service.SpiderTaskService;
import com.multiSpider.mapper.SpiderTaskMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
* @author CharlesForbit
* @description 针对表【spider_task】的数据库操作Service实现
* @createDate 2025-10-20 15:05:10
*/
@Service
public class SpiderTaskServiceImpl extends ServiceImpl<SpiderTaskMapper, SpiderTask>
    implements SpiderTaskService{
    @Override
    public List<String> getKeywords(Integer taskId){
        return getById(taskId).getKeywords();
    }
}




