package com.multiSpider.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.multiSpider.common.exception.SpiderException;
import com.multiSpider.common.result.Result;
import com.multiSpider.entity.MQReturn;
import com.multiSpider.entity.SpiderResult;
import com.multiSpider.entity.SpiderTask;
import com.multiSpider.entity.TaskName;
import com.multiSpider.service.SpiderCrawlerService;
import com.multiSpider.service.SpiderTaskService;
import jakarta.websocket.server.PathParam;
import org.apache.ibatis.annotations.Param;
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
    public Result<List<SpiderTask>> querySpiderTask(){
        try{
            List<SpiderTask> list = spiderTaskService.list();
            Long total = spiderTaskService.count();
            return Result.ok(list,total);
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
    @GetMapping("/search")
    public Result<List<SpiderTask>> searchSpiderTask(
            @RequestParam(required = false,defaultValue="1") Integer currentPage,
            @RequestParam(required = false,defaultValue="10") Integer pageSize,
            @RequestParam String searchKeyword,
            @RequestParam String status){
        try{

            Page<SpiderTask> result= spiderTaskService.listSearchTasks(currentPage, pageSize, searchKeyword, status);
            return Result.ok("查询成功",result.getRecords(),result.getTotal());
        }catch (SpiderException e){
            e.printStackTrace();
            return Result.fail(500,"搜索失败");
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
}
