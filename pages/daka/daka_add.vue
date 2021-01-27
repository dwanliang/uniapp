<template>
	<view class="container999">
		<view class='line' v-if="group.length>0">
			<view class='lineLeft'>发布到</view>
			<view class="lineRight">
				<picker :range="group" :range-key="'groups_name'" @change="groupChange">
					{{ group[groupIndex].groups_name}} 
				</picker>
			</view>
		</view>
		<view class="line" v-else>
			<view class='lineLeft'>发布到</view>
			<view class="lineRight">  
				你还没有团队<text class="blue">去创建团队>>>>>>>></text>
			</view>
		</view>
		<view class='line'>
			<view class='lineLeft'>时限</view>
			<view class="lineRight">  
				<picker :range="limit" :range-key="'name'" @change="limitChange">
					{{ limit[limitIndex].name}} 
				</picker>
			</view>
		</view>
		<view class="uni-padding-wrap" v-if="limitIndex==2">
			<checkbox-group @change="checkboxChange($event)" class="check">
				<view v-for="(items,indexs) in zidingyi">
					<label class="" :key="items.id">
						<checkbox :value="items.id"/>{{items.name}}
					</label>
				</view>
			</checkbox-group>
		</view>
		<view class='line'>
			<view class='lineLeft'>开始时间</view>
			<view class="lineRight">  
				<test-com beginYear="2021" endYear="2030" ke="1"  @show="start"></test-com>
			</view>
		</view>
		<view class='line'>
			<view class='lineLeft'>结束时间</view>
			<view class="lineRight">
				<test-com beginYear="2021" endYear="2030" ke="1" @show="end"></test-com>
			</view>
		</view>
		<view class='line' style="flex-wrap: wrap;">
			<view class='lineLeft'>打卡备注</view>
			<view class="lineRight" style="margin-top: 20rpx;height: 300px;overflow-x: hidden;overflow-y: scroll;">  
				<textarea v-model="daka_con" placeholder="打卡备注"/>
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
	import jinEdit from '../../components/jin-edit/jin-edit.vue';
	export default{
		components: {
			testCom,
			jinEdit
		},
		data(){
			return{
				limit:[
					{'id':1,'name':'今日'},
					{'id':2,'name':'每天'},
					{'id':3,'name':'自定义'},
				],
				zidingyi:[
					{'id':'1','name':'星期一'},
					{'id':'2','name':'星期二'},
					{'id':'3','name':'星期三'},
					{'id':'4','name':'星期四'},
					{'id':'5','name':'星期五'},
					{'id':'6','name':'星期六'},
					{'id':'7','name':'星期日'},
				],
				limitIndex:0,
				group:[],
				groupIndex:0,
				time_end:'',
				time_start:'',
				title:'',
				daka_con:'',
				placeholder: '开始输入...',
				daka_con:'',//打卡备注
				date:[],
			}
		},
		onLoad(e){
			// this.chushihua(e)
			this.form_list();
		},
		methods:{
			form_list(){
				this.$request(apps.api.groups_list,).then(res => {
					if(res.code==200){
						this.group=res.data;
					}
				})
			},
			checkboxChange(e){
				this.date=e.detail.value;
			},
			end(val){
				this.time_end=val.selectRes;
				console.log(val)
			},
			start(val){
				this.time_start=val.selectRes;
				console.log(val)
			},
			show(val){
				this.time_end=val.selectRes;
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
				console.log(this.limitIndex)
			},
			submit(){//提交
				var groups_id=this.group[this.groupIndex].id;
				var time_end=this.time_end;
				var time_start=this.time_start;
				var daka_con=this.daka_con;
				var type=this.limitIndex;
				var date=this.date;
				console.log(date)
				var data={groups_id:groups_id,time_start:time_start,time_end:time_end,type:type,daka_con:daka_con,date:date}
				this.$request(apps.api.daka_add,data).then(res => {
					apps.tan(res.msg,1000)
					if(res.code==200){
						setTimeout(()=>{
							uni.navigateTo({
								url:'../daka/daka_list'
							})
						},1000)
					}
				})
			},
			// GetChange(e){//电脑端
			// 	console.log(e)
			// }
		}
	}
	
	
</script>
	
<style>
	.check,.radio{
		display: flex;
		flex-wrap: wrap;
	}
	.check uni-label{
		padding: 0!important;
	}
	.check view{
		width: 33%;
		padding: 10rpx 0;
	}
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
