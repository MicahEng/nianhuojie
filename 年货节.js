/**
*京东年货节活动脚本
*参考脚本改编，原脚本为:淘宝+京东双十一活动脚本
*可访问：Github: https://github.com/hyue418
*感谢Hyue418大佬的原脚本
*小小耀
*/

//开启无障碍判定
try {
    auto();
} catch (error) {
    toast("请手动开启无障碍并授权给Auto.js");
    sleep(2000);
    exit();
}


//初始化参数
versions = 'V1.0.0';
speed = 1;
float = 1.25;
patNum = 0;
swipeTips = "滑啊滑啊滑啊滑ヽ(￣▽￣)ﾉ";
taskChooseList = ["京东炸年兽"];
speedChooseList = [0.75, 1, 1.25, 1.5, 1.75, 2, 3];
//taobaoActivityData = "taobao://pages.tmall.com/wow/z/hdwk/act-20201111/index";
//alipaysActivityData = "alipays://platformapi/startapp?appId=68687502";
width = device.width;
height = device.height;
setScreenMetrics(width, height);

alert("【年货节活动脚本 " + versions + "】", "脚本执行过程请勿手动点击屏幕，否则脚本执行可能会错乱，导致任务失败\n执行过程中可按音量+键终止\n参考脚本改编，原脚本为:淘宝+京东双十一活动脚本\n可访问：Github: https://github.com/hyue418\n年货节脚本访问：\n");
//选择任务
taskChoose();

/**
 * 任务选择
 */
function taskChoose() {
    var options = dialogs.multiChoice("需要执行的任务", taskChooseList);
    if (options == '') {
        toastLog("脚本已退出");
        exit();
    }
    //勾选调速时弹出速度选择
    options.indexOf(4) > -1 && speedChoose();   
    runOptions(options);
}


/**
 * 速度选择
 */
function speedChoose() {
    var option = dialogs.singleChoice("操作间隔的倍数（越大越慢）", speedChooseList, 1);
    if (option == -1) {
        toastLog("脚本已退出");
        exit();
    }
    speed = speedChooseList[option];
}

/**
 * 执行选中任务
 * @param options 选项数组
 */
function runOptions(options) {
    console.show();
    log("年货节活动脚本" + versions + "\n");
    log("脚本执行期间请勿手动点击按钮");
    log("当前脚本操作时间间隔为【" + speed + "倍】");
    options.forEach(option => {
        switch (option) {
            case 0:
                //执行京东任务
                var taskList = ['签到', '去完成'];
                log("=====开始执行" + taskChooseList[option] + "=====");
                runJd(taskList);
                break;
            default:
                break;
        }
    });
    alert("任务已完成", "所有任务貌似都做完啦！\n若仍有任务请重新运行噢！\n");
}


/**
 * 京东活动脚本
 */
function runJd(taskList) {
    var i = 0;
    var j = 0;
    launch("com.jingdong.app.mall");
    randomSleep(3000);
    //打开活动页
    jdOpenActivityPage();
    taskList.forEach(task => {
        while (textContains(task).exists()) {
            var button = text(task).findOnce(j);
            if (button == null) {
                break;
            }
            log("开始做第" + (i + 1) + "次任务");
            switch (task) {
                case '签到':
                    jdClickButton(button);
                    log("签到成功");
                    i++;
                    randomSleep(1000);
                    break;
                case '去完成':
                    var k = 0;
                    jdClickButton(button);
                    randomSleep(1000);
                    if (className("android.view.View").textContains("取消").exists()) {
                        log("跳过助力任务");
                        j++;
                        i++;
                        clickContent("取消");
                        randomSleep(1000);
                        break;
                    } else {
                        randomSleep(1000);
                        //若未点击成功，则再点击五次，仍未成功则跳过
                        while (textContains(task).exists() && k < 5) {
                            jdClickButton(button);
                            randomSleep(300);
                            k++;
                        }
                        if (k >= 5) {
                            log("跳过该任务");
                            break;
                        }
                    }
                    randomSleep(2000);
                    if (textContains("加购").exists()) {
                        jdBrowsingOrShopping("加购");
                        back();
                        randomSleep(500);
                        break;
                    } else if (textContains("浏览").exists()) {
                        jdBrowsingOrShopping("浏览");
                        back();
                        randomSleep(500);
                        break;
                    } else if (textContains("入会").exists()) {
                        jdBrowsingOrShopping("入会");
                        back();
                        randomSleep(500);
                        break;
                    }
                    if (textContains("宠汪汪").exists() || textContains("京喜财富岛").exists() || textContains("天天加速").exists()) {
                        randomSleep(10000);
                    } else {
                        randomSleep(2500);
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(2200);
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(3500);
                        toast(swipeTips);
                        randomSwipe();
                    }
                    descContains("获得").findOne(8000 * speed);
                    randomSleep(500);
                    i++;
                    log("已完成");
                    back();
                    randomSleep(4000);
                    break;
                default:
                    log("跳过")
                    break;
            }
            //任务容错
            if (!textContains("已完成").exists() && !textContains("未完成").exists()) {
                //判定京东首页，重新打开活动
                if (textContains("扫啊扫").exists() && textContains("消息").exists()) {
                    log("哦豁，不知为啥回来首页了，点回去");
                    jdOpenActivityPage();
                    continue;
                }
                randomSleep(1000);
                //判定微信页面,兼容小程序任务
                if (textContains("微信").exists()) {
                    log("完成小程序任务，跳回京东活动页");
                    launch("com.jingdong.app.mall");
                    randomSleep(2000);
                    continue;
                }
                //其他：未在活动列表页则再返回上一级（部分任务需二次返回）
                log("没有返回任务页，再次返回上一级");
                back();
                randomSleep(500);
            }
        }
    });
    toastLog("【京东】任务已完成");
    log("=========================");
}

/**
 * 京东-打开活动页
 */
function jdOpenActivityPage() {
    var activityButton = "炸年兽分10亿";
    if (!descContains(activityButton).exists()) {
        alert("温馨提示", "首页没有找到活动入口浮层\n请手动打开活动页，进入后脚本会自动执行");
    } else {
        clickContent(activityButton, "desc");
        log("正在打开【京东】活动页");
        randomSleep(300);
        //部分账号首页的活动浮层默认是收起状态，再次点击(有时候会点击失败，所以用while)
        while (descContains(activityButton).exists()) {
            clickContent(activityButton, "desc");
            randomSleep(300);
        }
        toastLog("若页面有弹窗，请手动关闭");
        randomSleep(5000);
    }
    //收两次金币
    randomSleep(1000);
    //等一下手动打开活动页的
    jdcollectCoins();
    randomSleep(500);
    jdcollectCoins();
    toastLog("收取爆竹成功");
    randomSleep(1000);
    text("集爆竹").waitFor();
    clickContent("集爆竹");
    log("展开任务列表");
    randomSleep(1000);
    //未打开任务列表则再次尝试点击
    while (!textContains("去完成").exists() && !textContains("已完成").exists()) {
        if (!textContains("集爆竹").exists()) {
            back();
            randomSleep(1000);
            continue;
        }
        log("没点到，再点一下");
        clickContent("集爆竹");
        randomSleep(300);
    }
}

/**
 * 京东-收取爆竹
 */
function jdcollectCoins() {
    var collectButton = text("集满啦").findOnce();
    collectButton && jdClickButton(collectButton);
}

/**
 * 京东-浏览/加购任务
 * @param taskName 任务名：浏览/加购
 */
function jdBrowsingOrShopping(taskName) {
    log("进入【" + taskName + "】任务");
    toastLog("日志窗口已隐藏");
    console.hide();
    randomSleep(200);
    for (i = 0; i < 6; i++) {
        if (i == 4) {
            log(swipeTips);
            randomSwipe();
            randomSleep(500);
        }
        var price = textContains("¥").findOnce(i);
        var goods = price.parent().parent();
        var suffix = i == 5 ? "(容错)" : '';
        log(taskName + "第" + (i + 1) + "个商品" + suffix);
        if (taskName == "浏览") {
            jdClickButton(goods);
            randomSleep(1000);
            //若未点击成功，则再次点击
            while (textContains("浏览").exists()) {
                jdClickButton(goods);
                randomSleep(300);
            }
            randomSleep(3000);
            //商品页可能会有缺货弹窗，点掉
            if (textContains("取消").exists()) {
                clickContent("取消");
                randomSleep(500);
            }
            log(swipeTips);
            randomSwipe();
            randomSleep(1000);
            back();
            randomSleep(1500);
        } else if (taskName == "加购") {
            var shopping = goods.child(goods.child(0).text() == "已加购" ? 5 : 4);
            click(shopping.bounds().centerX(), shopping.bounds().centerY());
            randomSleep(2500);
            back();
            randomSleep(2500);
        } else if (taskName == "入会") {
            randomSleep(2500);
            back();
            randomSleep(1500);
        }
    }
    console.show();
}


/**
 * 通过文字内容模拟点击按钮
 * @param content 按钮文字内容
 * @param type 点击类型，默认为text点击
 * @param sleepTime 等待时间，默认1000毫秒
 */
function clickContent(content, type, sleepTime) {
    var type = type || "text";
    var sleepTime = sleepTime || 1000;
    sleep(sleepTime * float * speed);
    if (type == "text") {
        var button = text(content).findOne();
    } else {
        var button = desc(content).findOne();
    }
    clickButton(button);
    return button;
}

/**
 * 根据控件的坐标范围随机模拟点击
 * @param button
 */
function clickButton(button) {
    var bounds = button.bounds();
    press(random(bounds.left, bounds.right), random(bounds.top, bounds.bottom), random(50, 100));
}

/**
 * 根据控件的坐标范围随机模拟点击（京东用）
 * 京东任务按钮有圆角，通用的随机点击方法容易点出圆角外导致点击失效，此处做修正
 * @param button
 */
function jdClickButton(button) {
    var bounds = button.bounds();
    var width = bounds.right - bounds.left;
    var high = bounds.top - bounds.bottom;
    press(random(bounds.left + width / 4, bounds.right - width / 4), random(bounds.top + high / 3, bounds.bottom - high / 3), random(50, 100));
}

/**
 * 根据float倍数sleep随机时间
 * @param time
 */
function randomSleep(time) {
    sleep(ramdomByFloat(time) * speed);
}

/**
 * 随机滑动
 */
function randomSwipe() {
    smlMove(ramdomByFloat(width / 2), ramdomByFloat(height / 1.5), ramdomByFloat(width / 2), ramdomByFloat(height / 4), ramdomByFloat(800));
}

/**
 * 范围随机数生成
 * @param min
 * @param max
 */
function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

/**
 * 根据float生成随机数
 * @param number
 */
function ramdomByFloat(number) {
    return random(number, number * float);
}

/**
 * 仿真随机带曲线滑动
 * @param qx 起点x轴坐标
 * @param qy 起点y轴坐标
 * @param zx 终点x轴坐标
 * @param zy 终点y轴坐标
 * @param time 滑动时间，毫秒
 */
function smlMove(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };
    var dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy, qy + 50)
    };
    var dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy, zy + 50),
    };
    var dx3 = {
        "x": zx,
        "y": zy
    };
    for (var i = 0; i < 4; i++) {
        eval("point.push(dx" + i + ")");
    }
    ;
    for (let i = 0; i < 1; i += 0.08) {
        xxyy = [parseInt(bezierCurves(point, i).x), parseInt(bezierCurves(point, i).y)];
        xxy.push(xxyy);
    }
    gesture.apply(null, xxy);
};

function bezierCurves(cp, t) {
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;

    tSquared = t * t;
    tCubed = tSquared * t;
    result = {
        "x": 0,
        "y": 0
    };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
};