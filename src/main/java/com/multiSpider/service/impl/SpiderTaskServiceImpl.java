package com.multiSpider.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.multiSpider.entity.SpiderTask;
import com.multiSpider.entity.TaskName;
import com.multiSpider.service.SpiderTaskService;
import com.multiSpider.mapper.SpiderTaskMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

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
    private final SpiderTaskMapper spiderTaskMapper;
    public SpiderTaskServiceImpl(SpiderTaskMapper spiderTaskMapper) {
        this.spiderTaskMapper = spiderTaskMapper;
    }
    @Override
    public List<String> getKeywords(Integer taskId){
        return getById(taskId).getKeywords();
    }
    @Override
    public List<TaskName> getTaskName(){
        return spiderTaskMapper.selectTaskName();
    }
    @Override
    public List<SpiderTask> getByStatus(String status){
        QueryWrapper<SpiderTask> queryWrapper=new QueryWrapper<>();
        queryWrapper.eq("status",status);
        return list(queryWrapper);
    }
    @Override
    public Page<SpiderTask> listSearchTasks(Integer currentPage,Integer pageSize,String searchKeyword,String status){
        QueryWrapper<SpiderTask> queryWrapper=new QueryWrapper<>();
        if(StringUtils.hasText(status)){
            queryWrapper.eq("status",status);
        }

        if(StringUtils.hasText(searchKeyword)){
            queryWrapper.and(q ->q
                    .like("name",searchKeyword)
                    .or().like("description",searchKeyword)
                    .or().like("keywords",searchKeyword)
            );
        }
        Page<SpiderTask> p=new Page<>(currentPage,pageSize);
        return page(p, queryWrapper);

    }
}




