package com.multiSpider.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.multiSpider.common.exception.SpiderException;
import com.multiSpider.common.result.Result;
import com.multiSpider.entity.*;
import com.multiSpider.service.SpiderCrawlerService;
import com.multiSpider.service.SpiderTaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/SpiderTask")
public class SpiderTaskController {
    private final SpiderTaskService spiderTaskService;
    private final SpiderCrawlerService spiderCrawlerService;
    public SpiderTaskController(SpiderTaskService spiderTaskService, SpiderCrawlerService spiderCrawlerService) {
        this.spiderTaskService = spiderTaskService;
        this.spiderCrawlerService=spiderCrawlerService;
    }
    @GetMapping("/query")
    public Result<List<SpiderTask>> querySpiderTask(
            @RequestParam(required = false,defaultValue="1") Integer currentPage,
            @RequestParam(required = false,defaultValue="10") Integer pageSize
    ){
        try{
            LambdaQueryWrapper<SpiderTask> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.orderByDesc(SpiderTask::getUpdatedAt);
            Page<SpiderTask> pageInfo =new Page<>(currentPage,pageSize);
            Page<SpiderTask> result= spiderTaskService.page(pageInfo,queryWrapper);
            return Result.ok("查询成功",result.getRecords(),result.getTotal());// 按 createTime 降序排列
        }catch (SpiderException e){
            e.printStackTrace();
            return Result.fail(500,"查询失败");
        }
    }
    @GetMapping("/getById/{id}")
    public Result<SpiderTask> getById(@PathVariable Long id){
        return Result.ok(spiderTaskService.getById(id));
    }
    @GetMapping("/getByStatus")
    public Result<List<SpiderTask>> getByStatus(@RequestParam String status){
        return Result.ok(spiderTaskService.getByStatus(status));
    }
    @GetMapping("/getTaskName")
    public Result<List<TaskName>> getTaskName(){
        try{
            List<TaskName> taskNames = spiderTaskService.getTaskName();
            return Result.ok(taskNames);
        }catch (SpiderException e){
            e.printStackTrace();
            return Result.fail(500,"查询失败");
        }
    }
    @PostMapping("/search")
    public Result<List<SpiderTask>> searchSpiderTask(
            @RequestBody(required = false) TaskSearchInfo taskSearchInfo
    ) {
        try {
            // 如果 searchInfo 是 null，创建一个默认的 SearchInfo 对象
            if (taskSearchInfo == null) {
                taskSearchInfo = new TaskSearchInfo();
                taskSearchInfo.setCurrentPage(1L);
                taskSearchInfo.setPageSize(10L);
            }

            Page<SpiderTask> result = spiderTaskService.listSearchTasks(taskSearchInfo);
            return Result.ok("查询成功", result.getRecords(), result.getTotal());
        } catch (SpiderException e) {
            e.printStackTrace();
            return Result.fail(500, "搜索失败");
        }
    }
    @PostMapping("/insert")
    public Result<String> insertSpiderTask(@RequestBody SpiderTask spiderTask){
        try{
            spiderTask.setStatus("已创建");
            spiderTaskService.save(spiderTask);
            return Result.ok("创建任务成功");
        }catch (SpiderException e){
            e.printStackTrace();
            return Result.fail(500,"创建任务失败");
        }

    }
    @PostMapping("/update")
    public Result<String> updateSpiderTask(@RequestBody SpiderTask spiderTask){
        spiderTaskService.updateById(spiderTask);
        return Result.ok("更新成功");
    }
    @PostMapping("/delete")
    public Result<String> deleteSpiderTask(@RequestParam Long id){
        spiderTaskService.removeById(id);
        return Result.ok("删除成功");
    }
    @GetMapping("/start")
    public Result<MQReturn> startSpiderTask(@RequestParam Integer id){
        MQReturn mqReturn=spiderCrawlerService.callApi(id);
        return Result.ok(mqReturn);
    }
    @PostMapping("/deleteBatch")
    public Result<String> deleteBatchSpiderTask(@RequestBody List<Long> ids){
        spiderTaskService.removeByIds(ids);
        return Result.ok("批量删除成功");
    }
}
