<template>
	<view class="content">
		<view class="form-con" v-for="(item,inde) in form_data" :key="inde">
			<view class="form-1">
				<view class="form-lae">
					<label >{{item.form_title}}</label>
					<label v-bind:class="item.time_few==1?'time-red':''">{{item.time_ends}}</label>
				</view>
				<view v-for="(tab,index) in item.form_con" :key="index" class="line form_line">
					<view class='lineLeft'>
						<text>{{tab.pro}}</text>
					</view>
					<view class="lineRight form_Rigth" style="position: relative;">
						<view class="">
							<!-- 单行文本 -->
							<input class="input dan_input" v-model="tab.value" data-name="name" placeholder-class="plaClass" :placeholder="tab.pro"  v-if="tab.type==1"></input>
							<!-- 多行文本 -->
							<textarea class="uni-textarea" maxlength="300" v-model="tab.value" :placeholder="tab.pro" v-if="tab.type==2"/>
							<!-- 单选 -->
							<view class="uni-padding-wrap" v-if="tab.type==3">
								<radio-group @change="radioChange($event,index)" class="radio">
									<label v-for="(items,indexs) in tab.radio_item.data" :key="indexs" class="radio">
										<radio :value="items.value" :checked="tab.radio_item.checked===indexs"/>{{items.name}}
									</label>
								</radio-group>
<!-- 								<view class="radio" v-for="(items, name ,indexs) in tab.radio_item.data" :key="indexs" >
									<input type="text" v-model="items.name">
								</view> -->
							</view>
							<!-- 多选 -->
							<view class="uni-padding-wrap" v-if="tab.type==4">
								<checkbox-group @change="checkboxChange($event,index)" class="check">
									<view v-for="(items,indexs) in tab.checkbox_item.data">
										<label class="" :key="indexs">
											<checkbox :value="items.value"/>{{items.name}}
										</label>
									</view>
								</checkbox-group>
							</view>
							<!-- 地址 -->
							<AddressPicker @change="change" :level="3" :indexs="index" v-if="tab.type==5">{{planLocate}} </AddressPicker>
							<!-- 时间 -->
							<test-com beginYear="2000" endYear="2030" @show="show" :indexs="index" v-if="tab.type==6"></test-com>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		<view class="buttonBox" @click="submit">
			提交
		</view>
	</view>
	
</template>
<style>
	
</style>
<script>
	const apps=getApp().globalData.comm;
	import testCom from '@/components/test_com.vue';
	import AddressPicker from "@/components/address/AddressPicker.vue"
	export default{
		components: {
			testCom,
			AddressPicker
		},
		data(){
			return{
				form_data:[{

				}],
				id:0,
				planLocate:'请选择地址'
			}
		},
		onLoad(e){
			this.form_con(e.id);
			this.id=e.id;
		},
		methods:{
			form_con(id){
				this.$request(apps.api.form_list, {'id':id,'uid':1},'post').then(res => {
					if(res.code==200){
						this.form_data=res.data.data;
						this.form_data[0].form_con=JSON.parse(this.form_data[0].form_con);
						this.time_end();
					}
					console.log(this.form_data)
				})
			},
			//父组件的获取子组件传递的值
			change(result) {
				 console.log(JSON.stringify(result.data));
				  this.planLocate = ''; 
				  result.data.forEach( (item,index) =>{
					  if(index===0){
						   this.planLocate += item.name
					  }else{
						  this.planLocate += '-' +item.name  
					  }
				  }) ;
				  let arr =this.planLocate.split('-');
				  this.form_data[0].form_con[result.indexs].value=this.planLocate;
				  console.log(this.form_data[0].form_con[result.indexs])
			},
			show(val){
				this.form_data[0].form_con[val.indexs].value=val.selectRes;
				console.log(this.form_data[0].form_con[val.indexs])
			},
			radioChange(e,index){
				for (let i = 0; i < this.form_data[0].form_con[index].radio_item.data.length; i++) {
					if (this.form_data[0].form_con[index].radio_item.data[i].value === e.target.value) {
						this.form_data[0].form_con[index].radio_item.checked=i//设置默认选中
					}
				}
				console.log(this.form_data[0].form_con[index])
			},
			checkboxChange(e,index){
				for (let i = 0; i < this.form_data[0].form_con[index].checkbox_item.data.length; i++) {
					if (e.target.value.indexOf(this.form_data[0].form_con[index].checkbox_item.data[i].value)>-1){
						this.form_data[0].form_con[index].checkbox_item.data[i].checked=true//选中
						continue;
					}else{
						this.form_data[0].form_con[index].checkbox_item.data[i].checked=false//未选中
					}
				}
				console.log(this.form_data[0].form_con[index])
			},
			time_end(){//列表时间倒计时
				for(var i=0;this.form_data.length>i;i++){//表单列表长度for
					var lefttime=apps.time_ends(this.form_data[i].time_end)//获得表单剩余秒数
					if(lefttime<=0){
						this.form_data[i].time_ends="表单已结束"
						continue;
					}
					if(lefttime<300){//剩5分钟，字体变红
						this.form_data[i].time_few=1;
					}
					this.form_data[i].time_ends=apps.time_date(lefttime)//赋值倒计时
				}
				setTimeout(()=>{//递归
					this.$forceUpdate()//重新渲染
					this.time_end();
				},1000)
			},
			form_oper(key){
				var da=this.form_data[0]
				var data= key==1?da.top:key==2?da.coll:da.over;
				if(!data){
					data=1
				}else{
					if(key==3) return
					data=0
				}
				console.log(this.form_data)
				this.$request(apps.api.form_oper, {
					'form_id':this.id,
					'type':key,
					'state':data
				},'post').then(res => {
					if(res.code==200){
						this.form_con(this.id)
					}
					apps.tan(res.msg,1000);
				})
			},
			submit(){
				var data=this.form_data[0].form_con;
				console.log(data)
				var i=0
				var coll_title='';
				var coll_con='';
				for(i in data){
					var checkbox_con='';
					var da=data[i];
					if(da.type!==3 && da.type!==4){
						coll_con+=da.value+'#';
					}else if(da.type==3){
						coll_con+=da.radio_item.data[da.radio_item.checked].name+'#';
					}else if(da.type==4){
						for(var i=0;i<da.checkbox_item.data.length;i++){
							console.log(da.checkbox_item.data[i])
							if(da.checkbox_item.data[i].checked){
								checkbox_con+=da.checkbox_item.data[i].name+'&'
							}
						}
						checkbox_con=checkbox_con.substr(0,checkbox_con.length-1)
						coll_con+=checkbox_con+'#';
					}
					coll_title+=da.pro+'#';
				}
				coll_title=coll_title.substr(0,coll_title.length-1)
				coll_con=coll_con.substr(0,coll_con.length-1)
				this.$request(apps.api.form_coll,{
					'id':this.id,
					'coll_con':coll_con,
					'coll_title':coll_title,
				}).then(res=>{
					apps.tan(res.msg,1000);
					if(res.code==200){
						setTimeout(()=>{
							uni.navigateTo({
								url: '/pages/form/form_list',//跳转页面
							})
						},1000)
					}
				})
			}

		}
	}
</script>

<style>
	/* .uni-padding-wrap view{
		float: left;
	} */
	.form-1 uni-label[data-v-38317403]:nth-child(2){
		color: #000000!important;
	}
	.radio uni-label{
		width: 50%;
		padding: 10rpx 0;
	}
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
	.form-con{
		/* margin:20rpx; */
		/* padding-bottom: 15rpx; */
		padding: 20rpx;
		background-color: white;
		border-radius: 10rpx;
	}
	.form-lae{
		display: flex;
		justify-content:space-between
	}
	.form-1 rich-text{
		font-size: 22rpx;
		padding: 0 18rpx;
		color: #555555;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.form-1 label{
		font-size: 25rpx;
		font-weight: 700;
		padding: 18rpx;
	}
	.form-1 label:nth-child(2){
		color: #999999;
	}
	.content{
		height: 100%;
	}
	.bottom_com{
		width: 100%;
		position: fixed;
		height: 100rpx;
		bottom: 0;
	}
	.com_con{
		height: 100rpx;
		display: flex;
	}
	.com_con view{
		height: 100rpx;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.coll{
		width: 20%;
		background-color: #007AFF;
	}
	.colls{
		background-color: #a64dff;
	}
	.top{
		width: 20%;
		background-color: #d98c8c;
	}
	.tops{
		background-color: #666600;
	}
	.over{
		width: 60%;
		background-color: deepskyblue;
	}
	.overs{
		background-color: #c2c2d6;
	}
	.dan_input{
		height: 2.5em;
	}
	.form_con .lineLeft{
		width: 100%;
	}
	/* .form-1 uni-label{
		padding: 0!important;
	} */
	.radio,.checkbox{
		float: left;
		width: 100%;
		padding: 10rpx 0!important;
	}
	.uni-textarea{
		width: 100%;
	}
	.form_con{
		margin-top: 50rpx;
	}
	.remore{
		position: absolute;
		right: 10rpx;
	}
	.remore image,.deletes image,.radio_add image{
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
	}
	.deletes{
		position: absolute;
		left: 10rpx;
	}
	.uni-list-line{
		position: relative;
		padding: 20rpx 20rpx;
		border-bottom: 2rpx #999 solid;
	}
	.uni-list-pro{
		color: #999;
		font-size: 30rpx;
	}
	.lineLeft{
		width: 160rpx;
		/* float: left; */
		padding: 0 20rpx;
		font-size: 28rpx;
		position: relative;
		/* top: 6rpx; */
		font-weight: 800;
	}
	.lineLeft input{
		font-size: 30rpx;
	}
	.line,.form_line{
		border-bottom: 2rpx solid #cccc;
		/* padding: 24rpx 0; */
		/* padding-bottom: 20rpx; */
		margin: 24rpx 0;
		display: flex;
		position: relative;
	}
	.form_line{
		flex-wrap: wrap;
	}
	.form_Rigth{
		padding-left: 16rpx;
	}
	.lineRight{
		width: 100%;
		font-size: 30rpx;
	}
	.buttonBox{
		width: 80%;
		background-color: deepskyblue;
		color: white;
		text-align: center;
		margin: 0 auto;
		padding: 20rpx;
		border-radius: 36rpx;
		/* position: fixed; */
		bottom: 300rpx;
		left: 8%;
	}
	.container{
		padding: 0;
	}
	.ql-container{
		margin: 0;
	}
	.blue{
		color: blue;
	}
	.radio_add{
		font-size: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		position: absolute;
		right: 80rpx;
	}
	.course-add{
		font-size: 20rpx;
		display: flex;
		justify-content: center;
		color: white;
		align-items: center;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin: 30rpx auto;
	}
	.course-add image{
		width: 60rpx;
		height: 60rpx;
		position: relative;
		right: 2rpx;
	}
</style>