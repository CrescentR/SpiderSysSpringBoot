package com.multiSpider.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.multiSpider.common.exception.SpiderException;
import com.multiSpider.common.result.Result;
import com.multiSpider.entity.ResultSearchInfo;
import com.multiSpider.entity.SpiderResult;
import com.multiSpider.entity.SpiderTask;
import com.multiSpider.entity.TaskSearchInfo;
import com.multiSpider.service.SpiderResultService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/SpiderResult")
public class SpiderResultController {
    private final SpiderResultService spiderResultService;
    public SpiderResultController(SpiderResultService spiderResultService) {
        this.spiderResultService = spiderResultService;
    }
//    @GetMapping("/query")
//    public Result<List<SpiderResult>> querySpiderResult(
//            @RequestParam(required = false,defaultValue="1") Integer currentPage,
//            @RequestParam(required = false,defaultValue="10") Integer pageSize
//    ){
//        try{
//            LambdaQueryWrapper<SpiderResult> queryWrapper = new LambdaQueryWrapper<>();
//            queryWrapper.orderByDesc(SpiderResult::getDateTime); // 按 createTime 降序排列
//            Page<SpiderResult> pageInfo =new Page<>(currentPage,pageSize);
//            Page<SpiderResult> result= spiderResultService.page(pageInfo,queryWrapper);
//            return Result.ok("查询成功",result.getRecords(),result.getTotal());
//        }catch (SpiderException e){
//            e.printStackTrace();
//            return Result.fail(500,"查询失败");
//        }
//    }
    @PostMapping("/search")
    public Result<List<SpiderResult>> searchSpiderTask(
            @RequestBody(required = false) ResultSearchInfo resultSearchInfo
    ) {
        try {
            // 如果 searchInfo 是 null，创建一个默认的 SearchInfo 对象
            if (resultSearchInfo == null) {
                resultSearchInfo = new ResultSearchInfo();
                resultSearchInfo.setCurrentPage(1L);
                resultSearchInfo.setPageSize(10L);
            }

            Page<SpiderResult> result = spiderResultService.listSearchResult(resultSearchInfo);
            return Result.ok("查询成功", result.getRecords(), result.getTotal());
        } catch (SpiderException e) {
            e.printStackTrace();
            return Result.fail(500, "搜索失败");
        }
    }
    @GetMapping("/getById/{id}")
    public Result<SpiderResult> getById(@PathVariable Long id){
        return Result.ok(spiderResultService.getById(id));
    }
    @PostMapping("/delete")
    public Result<String> deleteSpiderResult(@RequestBody Long id){
        spiderResultService.removeById(id);
        return Result.ok("删除成功");
    }
    @PostMapping("/deleteBatch")
    public Result<String> deleteBatchSpiderResult(@RequestBody List<Long> ids){
        spiderResultService.removeByIds(ids);
        return Result.ok("批量删除成功");
    }
}
