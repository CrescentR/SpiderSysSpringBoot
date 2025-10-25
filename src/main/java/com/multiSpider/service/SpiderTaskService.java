package com.multiSpider.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.multiSpider.entity.SpiderResult;
import com.multiSpider.entity.SpiderTask;
import com.baomidou.mybatisplus.extension.service.IService;
import com.multiSpider.entity.TaskName;

import java.util.List;

/**
* @author CharlesForbit
* @description 针对表【spider_task】的数据库操作Service
* @createDate 2025-10-20 15:05:10
*/
public interface SpiderTaskService extends IService<SpiderTask> {
    List<String> getKeywords(Integer taskId);
    List<TaskName> getTaskName();
    List<SpiderTask> getByStatus(String status);
    Page<SpiderTask> listSearchTasks(Integer currentPage, Integer pageSize, String searchKeyword, String status);
}
