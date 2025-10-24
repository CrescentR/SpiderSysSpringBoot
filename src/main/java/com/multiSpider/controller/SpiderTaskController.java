package com.multiSpider.controller;

import com.multiSpider.common.exception.SpiderException;
import com.multiSpider.common.result.Result;
import com.multiSpider.entity.SpiderTask;
import com.multiSpider.service.SpiderCrawlerService;
import com.multiSpider.service.SpiderTaskService;
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
    public Result<String> startSpiderTask(@RequestParam Integer id){
        spiderCrawlerService.callApi(id);
        return Result.ok("启动成功");
    }
}
