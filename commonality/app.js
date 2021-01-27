import md5 from 'md5.js';

var api={
	task_list:'Task/task_list',//任务列表
	task_add:'Task/task_add',//任务添加
	groups_list:'Groups/groups_list',//团队列表
	task_oper:'Task/task_oper',//任务收藏、置顶、完成
	form_list:'Form/form_list',//表单列表
	form_add:'Form/form_add',//表单添加
	form_template_add:'Form/form_template_add',//创建表单模板
	form_template_edit:'Form/form_template_edit',//编辑表单模板
	form_template_delete:'Form/form_template_delete',//编辑表单模板
	form_template:'Form/form_template',//我的表单模板
	form_coll:'Form/form_coll',//表单提交
	form_data:'Form/form_data',//表单数据
	form_daochu:'Form/fom_daochu',//表单导出
	my_form:'Form/my_form',//我的表单
	team_list:'Team/team_list',//团队列表
	team_add:'Team/team_add',//添加团队
	team_user_delete:'Team/team_user_delete',//移出队员
	team_admin:'Team/team_admin',//设成管理员
	team_edit:'Team/team_edit',//修改团队信息
	team_msg:'Team/team_msg',//团队公告
	team_new:'Team/team_new',//新消息
	team_user_add:'Team/team_user_add',//申请加团队
	msg_add:'Team/msg_add',//添加公告
	login:'User/login',//登录
	user_list:'User/user_list',//用户数据
	user_edit:'User/user_edit',//编辑用户
	user_add:'User/user_add',//注册用户
	user_wx:'User/user_wx',//微信小程序获取openid
	pass_reset:'User/pass_reset',//修改密码
	user_head:'User/user_head',//上传头像
	daka_list:'Daka/daka_list',//打卡列表
	daka:'Daka/daka',//打卡
	daka_add:'Daka/daka_add',//打卡添加
	course_add:'Course/course_add',//添加课程
	course_list:'Course/course_list',//课程列表
	course_edit:'Course/course_edit',//课程编辑
	note_list:'Note/note_list',//备忘录列表
	note_edit:'Note/note_edit',//修改备忘录
	note_add:'Note/note_add',//添加备忘录
	note_delete:'Note/note_delete',//备忘录删除
	team_search:'Team/team_search',//团队搜索
	user_search:'User/user_search',//用户搜索
	get_code:'User/get_code',//获取验证码
	main_index:'Main/main_index',//通讯录新消息
	my_friend:'User/my_friend',//我的朋友
	chat_con:'Chatroom/chat_con',//聊天内容
	chat_where:'Chatroom/chat_where',//判断聊天室是否存在
	user_new_add:'User/user_new_add',//添加好友
	user_new:'User/user_new',//新朋友列表
	user_new_edit:'User/user_new_edit',//处理新消息
}
const time=Math.round(new Date()/1000);//时间戳

const tan=(title,time,icon='none')=>{
	uni.showToast({
		title: title,
		icon: icon,
		duration:time,
	})
}
const time_ends=(time_end)=>{//返回剩余秒数
	var nowtime = new Date();
	var end_s=(time_end - nowtime.getTime()) / 1000;
	var lefttime = parseInt(end_s);
	return lefttime;
}
const time_date=(lefttime)=>{//小时分秒倒计时
	var h = parseInt(lefttime / (60 * 60) % 24);
	var m = parseInt(lefttime / 60 % 60);
	var s = parseInt(lefttime % 60);
	return h+":"+m+":"+s;
}
const islogin=()=>{
	// uni.removeStorageSync('input_info')
	var input_info=uni.getStorageSync('input_info');
	
	
	if(!input_info){
		// #ifdef MP-WEIXIN
		uni.reLaunch({
			url:'/pages/ge/index',
		})
		// #endif
		// #ifndef MP-WEIXIN
		var url = window.location.pathname;
		if(url.indexOf('form_con')==-1){
			uni.reLaunch({
				url:'/pages/login/login',
			})
		}
		// #endif
	}
	return input_info
}
var user_id=islogin().user_id;
var user_info=islogin();
const baseUrl = 'http://lzy.cn/api/'  
// const baseUrl = 'http://47.107.243.176/task/tp/public/index.php/api/' 
export default{
	islogin,
	time_ends,
	time_date,
	api,
	time,
	tan,
	user_id,
	user_info,
	baseUrl,
}