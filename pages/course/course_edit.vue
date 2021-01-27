<template>
	<view class="container999">
		<view class='line'>
			<view class='lineLeft'>课程名</view>
			<view class="lineRight">  
				<input class="input" v-model="courseName" data-name="name" placeholder-class="plaClass" placeholder='课程名'></input>
			</view>
		</view>
		<view class='line'>
			<view class='lineLeft'>任课老师</view>
			<view class="lineRight">  
				<input class="input" v-model="courseTeacher" data-name="name" placeholder-class="plaClass" placeholder='任课老师'></input>
			</view>
		</view>
		<view class='line'>
			<view class='lineLeft'>上课地点</view>
			<view class="lineRight">  
				<input class="input" v-model="courseAddress" data-name="name" placeholder-class="plaClass" placeholder='上课地点'></input>
			</view>
		</view>
		<view class='line'>
			<view class='lineLeft'>星期</view>
			<view class="lineRight">
				{{timeList[parseInt(week)-1].week}}
			</view>
		</view>
		<view class='line'>
			<view class='lineLeft'>开始时间</view>
			<view class="lineRight">  
				<test-com beginYear="2000" endYear="2030" ke="1"  @show="start" :date='date_start1' v-if="date_start1.length>0"></test-com>
			</view>
		</view>
		<view class='line'>
			<view class='lineLeft'>结束时间</view>
			<view class="lineRight">
				<test-com beginYear="2000" endYear="2030" ke="1" @show="end" :date='date_start2' v-if="date_start2.length>0"></test-com>
			</view>
		</view>
		<button type="primary" class="submit" @click="submit">
			提交
		</button>
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	import testCom from '../../components/test_com.vue';
	export default{
		components: {
			testCom,
		},
		data(){
			return{
				id:0,
				date_start1:[],//初始化时间   :date=date_start
				date_start2:[],
				week:1,//星期几
				timeList: [
					{time: '1',week: '星期一'},
					{time: '2',week: '星期二'},
					{time: '3',week: '星期三'},
					{time: '4',week: '星期四'},
					{time: '5',week: '星期五'},
					{time: '6',week: '星期六'},
					{time: '7',week: '星期日'},
				],
				time_end:'',
				time_start:'',
				courseName:'',
				courseAddress:'',
				courseTeacher:'',
				placeholder: '开始输入...'
			}
		},
		onLoad(e){
			this.id=e.id;
			this.course_list(e.id);
		},
		methods:{
			course_list(id){
				this.$request(apps.api.course_list,{course_id:id}).then(res=>{
					if(res.code==200){
						this.week=parseInt(res.data.week);
						this.courseName=res.data.courseName;
						this.date_start2=res.data.time_end.map(Number);
						this.date_start1=res.data.time_start.map(Number);
						console.log(this.date_start1)
						this.courseAddress=res.data.courseAddress;
						this.courseTeacher=res.data.courseTeacher;
					}
				})
			},
			end(val){
				this.time_end=val.selectRes;
				console.log(val)
			},
			start(val){
				this.time_start=val.selectRes;
				console.log(val)
			},
			editOk(res) {
			    console.log(res);
			},
			groupChange(e){
				this.groupIndex = e.detail.value;
			},
			limitChange(e){
				this.limitIndex = e.detail.value;
			},
			submit(){//提交
				var week=this.week;//星期
				var time_end=this.time_end;//结束时间
				var courseName=this.courseName;//课程名称
				var courseAddress=this.courseAddress;//课程地址
				var time_start=this.time_start;//开始时间
				var courseTeacher=this.courseTeacher;//任课老师
				if(time_end<time_start){
					apps.tan('结束时间小于开始时间');
					return;
				}
				var data={course_id:this.id,week:week,time_end:time_end,time_start:time_start,courseName:courseName,courseAddress:courseAddress,courseTeacher:courseTeacher}
				this.$request(apps.api.course_edit,data).then(res => {
					apps.tan(res.msg,1000)
					if(res.code==200){
						setTimeout(()=>{
							uni.navigateTo({
								url:'../course/course_list'
							})
						},1000)
					}
				})
			},
		}
	}
	
	
</script>
	
<style>
	.lineLeft{
		width: 160rpx;
		/* float: left; */
		padding: 0 20rpx;
		font-size: 28rpx;
		position: relative;
		top: 6rpx;
		font-weight: 800;
	}
	.line{
		border-bottom: 2rpx solid #cccc;
		padding: 24rpx;
		padding-bottom: 20rpx;
		display: flex;
	}
	.lineRight{
		width: 100%;
		font-size: 30rpx;
	}
	.container{
		padding: 0;
	}
	.ql-container{
		margin: 0;
	}
</style>
