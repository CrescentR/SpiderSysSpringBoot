package com.multiSpider.controller;

import com.multiSpider.common.exception.QuickStartException;
import com.multiSpider.common.result.Result;
import com.multiSpider.entity.SpiderTask;
import com.multiSpider.service.SpiderTaskService;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/SpiderTask")
public class SpiderTaskController {
    private final SpiderTaskService spiderTaskService;
    public SpiderTaskController(SpiderTaskService spiderTaskService) {
        this.spiderTaskService = spiderTaskService;
    }
    @GetMapping("/query")
    public Result<List<SpiderTask>> querySpiderTask(){
        try{
            List<SpiderTask> list = spiderTaskService.list();
            Long total = spiderTaskService.count();
            return Result.ok(list,total);
        }catch (QuickStartException e){
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
        spiderTaskService.save(spiderTask);
        return Result.ok("插入成功");
    }
    @PostMapping("/update")
    public Result<String> updateSpiderTask(@RequestBody SpiderTask spiderTask){
        spiderTaskService.updateById(spiderTask);
        return Result.ok("更新成功");
    }
    @PostMapping("/delete")
    public Result<String> deleteSpiderTask(@RequestBody Long id){
        spiderTaskService.removeById(id);
        return Result.ok("删除成功");
    }
}
