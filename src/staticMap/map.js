// 矿机等级（currentLevel）：0-0W，1-1W，3-3W,6-6W,9-9W
export const currentLevelMap = new Map([
    [0, "0W"],
    [1, "1W"],
    [3, "3W"],
    [6, "6W"],
    [9, "9W"],
    [27, "27W"]
]);


//团队等级 => 0-普通，3-M1，6-M2，9-M3
export const teamLevelMap = new Map([
    [0, "普通"],
    [3, "M1"],
    [6, "M2"],
    [9, "M3"]
]);

//会员状态 0=> 普通会员, 1=> 实名, 2=> 认证
// if (!memberLevel) memberLevelTxt = '普通会员'
// else if (memberLevel === 1) memberLevelTxt = '实名'
// else if (memberLevel === 2) memberLevelTxt = '认证'
export const memberStatusMap = new Map([
    [0, '普通会员'],
    [1, '实名'],
    [2, '认证']
])


//卡状态 0-可用1-已使用2-已禁用
export const cardStatusMap = new Map([
    [0, '可用'],
    [1, '已使用'],
    [2, '已禁用']
]);

//账户类型 0-矿机账户1-待释放账户2-买卖账户3-转账账户4-矿机收益账户
export const accountTypeMap = new Map([
    [0, '矿机账户'],
    [1, '待释放账户'],
    [2, '买卖账户'],
    [3, '转账账户'],
    [4, '矿机收益账户']
])

//手续费变动类型
// 清理1-买入2-卖出3-升级4-推荐奖励5-团队奖励6-管道奖励7-分红8-全球分红9-静态释放
export const transferUsdtBuyMap = new Map([
    [0, '清理'],
    [1, '买入'],
    [2, '卖出'],
    [3, '升级'],
    [4, '推荐奖励'],
    [5, '团队奖励'],
    [6, '管道奖励'],
    [7, '分红'],
    [8, '全球分红'],
    [9, '静态释放']
]);

//usdt手续费状态
export const usdtFeeMap = new Map([
    [0, '审核中'],
    [1, '等待放币'],
    [2, '失败'],
    [3, '成功'],
])