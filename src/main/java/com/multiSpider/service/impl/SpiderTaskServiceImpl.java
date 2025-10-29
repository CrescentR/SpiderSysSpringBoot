package com.multiSpider.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.multiSpider.dto.TaskSearchInfo;
import com.multiSpider.entity.SpiderTask;
import com.multiSpider.vo.TaskName;
import com.multiSpider.service.SpiderTaskService;
import com.multiSpider.mapper.SpiderTaskMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

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
    public Integer getTaskPageSize(Integer taskId) {
        return getById(taskId).getMaxPages();
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
    public Page<SpiderTask> listSearchTasks(TaskSearchInfo taskSearchInfo){
        QueryWrapper<SpiderTask> queryWrapper = new QueryWrapper<>();

        // 处理分页信息
        Long currentPage = taskSearchInfo.getCurrentPage() != null ? taskSearchInfo.getCurrentPage() : 1L;
        Long pageSize = taskSearchInfo.getPageSize() != null ? taskSearchInfo.getPageSize() : 10L;

        String status = taskSearchInfo.getStatus();
        String searchKeywords = taskSearchInfo.getSearchKeywords();
        String startTime = taskSearchInfo.getStartTime();
        String endTime = taskSearchInfo.getEndTime();

        if (StringUtils.hasText(status)) {
            queryWrapper.eq("status", status);
        }

        if (StringUtils.hasText(searchKeywords)) {
            queryWrapper.and(q -> q
                    .like("name", searchKeywords)
                    .or().like("description", searchKeywords)
                    .or().like("keywords", searchKeywords)
            );
        }

        // 处理时间范围
        if (StringUtils.hasText(startTime) && StringUtils.hasText(endTime)) {
            // 转换日期格式
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            LocalDateTime start = LocalDateTime.parse(startTime, formatter);
            LocalDateTime end = LocalDateTime.parse(endTime, formatter);

            queryWrapper.and(q -> q
                    .ge("updated_at", start)
                    .le("updated_at", end)
            );
        } else if (StringUtils.hasText(startTime)) {
            // 单一开始时间
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            LocalDateTime start = LocalDateTime.parse(startTime, formatter);

            queryWrapper.and(q -> q
                    .ge("updated_at", start)
            );
        }

        // 创建分页对象
        Page<SpiderTask> page = new Page<>(currentPage, pageSize);
        return page(page, queryWrapper);
    }
}




