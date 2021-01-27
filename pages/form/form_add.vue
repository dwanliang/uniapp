<template>
	<view class="container999" :style="{background: 'linear-gradient(125deg,'+color[color1]+','+color[color2]+')'}">
		<view class='line'>
			<view class='lineLeft'>标题</view>
			<view class="lineRight">  
				<input class="input" v-model="form_title" data-name="name" placeholder-class="plaClass" placeholder='请输入标题'></input>
			</view>
		</view>
		<view class='line' v-if="group.length>0">
			<view class='lineLeft'>表单范围</view>
			<view class="lineRight">
				<picker :range="submit_type" :range-key="'submit_name'" @change="submitChange">
					{{ submit_type[submitIndex].submit_name}} 
				</picker>
			</view>
		</view>
		<view class='line' v-if="group.length>0 && submitIndex==0">
			<view class='lineLeft'>发布到</view>
			<view class="lineRight">
				<picker :range="group" :range-key="'groups_name'" @change="groupChange">
					{{ group[groupIndex].groups_name}} 
				</picker>
			</view>
		</view>
		<view class="line" v-if="group.length==0 && submitIndex==0">
			<view class='lineLeft'>发布到</view>
			<view class="lineRight">
				你还没有团队<text class="blue">去创建团队>>>>>>>></text>
			</view>
		</view>
		<view class='line'>
			<view class='lineLeft'>结束时间</view>
			<view class="lineRight">  
				<test-com beginYear="2021" endYear="2030" @show="show"></test-com>
			</view>
		</view>
		<view class='line' style="flex-wrap: wrap;border-bottom:none!important;">
			<view class='lineLeft' style="">表单内容:</view>
		</view>
		<view class="form_con">
			<view v-for="(tab,index) in tabs" :key="index" class="line form_line">
				<view class='lineLeft'>
					<input type="text" v-model="tab.pro">
				</view>
				<view class="lineRight form_Rigth" style="position: relative;">
					<view class="">
						<!-- 单行文本 -->
						<input class="input dan_input" v-model="tab.value" data-name="name" placeholder-class="plaClass" :placeholder="tab.pro"  v-if="tab.type==1"></input>
						<!-- 多行文本 -->
						<textarea class="uni-textarea" maxlength="300" v-model="tab.value" :placeholder="tab.pro" v-if="tab.type==2"/>
						<!-- 单选 -->
						<view class="uni-padding-wrap" v-if="tab.type==3" style="padding-left: 40rpx;">
							<!-- <radio-group @change="radioChange($event,index)">
								<label v-for="(items,indexs) in tab.radio_item.data" :key="indexs" class="radio">
									<radio :value="items" :checked="tab.radio_item.checked===indexs"/>{{items}}
								</label>
							</radio-group> -->
							<view class="radio" v-for="(items, name ,indexs) in tab.radio_item.data" :key="indexs" >
								<view class="deletes" @click="deletes(index,indexs,tab.type)">
									<image src="../../static/img/jian.png" mode=""></image>
								</view>
								<input type="text" v-model="items.name">
							</view>
						</view>
						<!-- 多选 -->
						<view class="uni-padding-wrap" v-if="tab.type==4" style="padding-left: 40rpx;">
							<view class="checkbox" v-for="(items, name ,indexs) in tab.checkbox_item.data" :key="indexs" >
								<view class="deletes" @click="deletes(index,indexs,tab.type)">
									<image src="../../static/img/jian.png" mode=""></image>
								</view>
								<input type="text" v-model="items.name">
							</view>
						</view>
						<!-- 地址 -->
						<AddressPicker @change="change" :level="3" :indexs="index" v-if="tab.type==5">{{planLocate}} </AddressPicker>
						<!-- 时间 -->
						<test-com beginYear="2000" endYear="2030" @show="show" v-if="tab.type==6"></test-com>
					</view>
					
				</view>
				<view class="radio_add" @tap="option_add(index,tab.type)" v-if="tab.type==3 || tab.type==4">
					<image src="../../static/img/jia.png" mode=""></image>
				</view>
				<view class="remore" @click="remove(index)">
					<image src="../../static/img/jian.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="course-add" @tap="input_add()">
			<image src="../../static/img/jia.png" mode=""></image>
		</view>
		<view class="bottom_com">
			<view class="com_con" v-if="!id">
				<view class="coll" @click="submit(2)">创建模板</view>
				<view class="over" @click="submit(1)">发布</view>
			</view>
			<view class="com_con" v-if="id">
				<view class="delet" @click="submit(4)">删除</view>
				<view class="colls" @click="submit(3)">保存</view>
				<view class="over" @click="submit(1)">发布</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	const apps=getApp().globalData.comm;
	import testCom from '../../components/test_com.vue';
	import AddressPicker from "@/components/address/AddressPicker.vue"
	export default{
		components: {
			testCom,
			AddressPicker
		},
		data(){
			return{
				id:0,
				group:[],
				groupIndex:0,
				time_end:'',
				form_title:'',
				form_con:'',
				placeholder: '开始输入...',
				index: 0,		//生成表单的索引						
				tabs: [],		//生成表单所有生成对象的数组,[{},{},{}]
				proName: ['单行文本', '多行文本', '单选框', '多选框','地址','时间'],
				radio_value:2,
				checkbox_value:2,
				planLocate:'请选择地址',
				address_start:false,
				submit_type:[{submit_name:'团队',type:'team'},{submit_name:'所有人',type:'all'}],
				color:['#80ff80','#4dd2ff','#ff80aa','#eb99ff','#ff8080','#b3e0ff','#6666ff'],
				submitIndex:0,
				color1:0,
				color2:0,
			}
		},
		onLoad(e){
			this.id=e.id;
			this.color1=e.color1;
			this.color2=e.color2;
			this.form_list(e.id);
		},
		methods:{
			form_list(id){
				this.$request(apps.api.groups_list,).then(res => {
					if(res.code==200){
						this.group=res.data;
					}
				})
				if(id){
					uni.setNavigationBarTitle({
						title:'表单模板编辑'
					});
					this.$request(apps.api.form_template,{'template_id':id}).then(res => {
						if(res.code==200){
							this.form_title=res.data.title;
							this.tabs=res.data.data;
						}
					})
				}
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
				  this.tabs[result.indexs].value=this.planLocate;
				  console.log(this.tabs)
			},
			show(val){
				this.time_end=val.selectRes;
			},
			editOk(res) {
			    console.log(res);
			},
			groupChange:function(e){
				this.groupIndex = e.detail.value;
			},
			submitChange(e){
				this.submitIndex = e.detail.value;
			},
			// radioChange(e,index){
			// 	for (let i = 0; i < this.tabs[index].radio_item.data.length; i++) {
			// 		if (this.tabs[index].radio_item.data[i] === e.target.value) {
			// 			this.tabs[index].radio_item.checked=i//设置默认选中
			// 		}
			// 	}
			// 	console.log(this.tabs[index])
			// },
			option_add(index,type){
				if(type==3){
					var length=this.tabs[index].radio_item.data.length+1;
					if(length>10){
						apps.tan('选项过多!',1000);return
					}
					this.radio_value++;
					this.tabs[index].radio_item.data.push({name:'选项'+this.radio_value,value:this.radio_value+''})
				}else{
					var length=this.tabs[index].checkbox_item.data.length+1;
					if(length>10){
						apps.tan('选项过多!',1000);return
					}
					this.checkbox_value++;
					this.tabs[index].checkbox_item.data.push({name:'选项'+this.checkbox_value,value:this.checkbox_value+''})
				}
			},
			get_cont(res){
				this.form_con=res;
			},
			input_add(){
				var that=this;
				uni.showActionSheet({
					title: "您要添加的表单类型",
					itemColor: "deepskyblue",
					itemList: that.proName,
					success: (res) => {
						this.addInner(res.tapIndex)
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
					},
					fail: (res) => {
						console.log(res.errMsg);
					}
				});

			},
			addInner(e) {
				this.index += 1;
				var data={
					id: this.index,
					value: ``,
					pro: `${this.proName[e]}`,
					type:e+1,
				}
				if(e==2){//单选
					Object.assign(data,{
						'radio_item':{
							'data':[{name:'选项1',value:'1'},{name:'选项2',value:'2'}],
							'checked':0
						}
					})
				}else if(e==3){//多选
					Object.assign(data,{
						'checkbox_item':{
							'data':[{name:'选项1',value:'1'},{name:'选项2',value:'2'}],
						}
					})
				}else if(e==4){//地址
					if(!this.address_start){
						this.address_start=true;
					}else{
						apps.tan('只能添加一个地址组件',1000);return
					}
				}
				this.tabs.push(data);
			},
			remove(index){
				this.tabs.splice(index,1);
			},
			deletes(index,indexs,type){
				if(type==3){
					var length=this.tabs[index].radio_item.data.length+1;
					if(length<=2){
						apps.tan('最少一个选项!',1000);return
					}
					this.tabs[index].radio_item.data.splice(indexs,1);
				}else{
					var length=this.tabs[index].checkbox_item.data.length+1;
					if(length<=2){
						apps.tan('最少一个选项!',1000);return
					}
					this.tabs[index].checkbox_item.data.splice(indexs,1);
				}
				console.log(this.tabs)
			},
			submit(type){//提交
				var groups_id=this.group[this.groupIndex].id;
				if(!groups_id){
					apps.tan('请选择组织',1000);return;
				}
				var time_end=this.time_end;
				if(time_end<Math.round(new Date()/1000)){
					apps.tan('结束时间必须大于当前时间',1000);return
				}
				var form_title=this.form_title;
				if(!form_title){
					apps.tan('请填写表单标题',1000);return
				}
				if(this.tabs.length<1){
					apps.tan('没有表单!',1000);return
				}
				var submit_type=this.submit_type[this.submitIndex].type;
				var form_con=JSON.stringify(this.tabs);
				var url='';
				var data={
					'groups_id':groups_id,
					'time_end':time_end,
					'form_title':form_title,
					'form_con':form_con,
					submit_type:submit_type
				};
				if(type==1){//发布
					url=apps.api.form_add;
				}else if(type==2){//创建模板
					url=apps.api.form_template_add;
				}else if(type==3){//修改模板
					url=apps.api.form_template_edit;
					Object.assign(data,{template_id:this.id})
				}else{//删除模板
					url=apps.api.form_template_delete;
					Object.assign(data,{template_id:this.id})
					var that=this;
					uni.showModal({
					    title: '是否删除此模板！',
					    success: function (res) {
					        if (res.confirm) {
					            that.teamplate(url,data)
					        }
					    }
					});
					return;
				}
				this.teamplate(url,data)
			},
			teamplate(url,data){
				this.$request(url,data).then(res=>{
					apps.tan(res.msg,1000);
					if(res.code==200){
						setTimeout(()=>{
							uni.navigateTo({
								url: '/pages/form/my_form'
							})
						},1000)
					}
				})
			}
		}
	}
	
	
</script>
	
<style>
	.dan_input{
		height: 2.5em;
	}
	.form_con .lineLeft{
		width: 100%;
	}
	.radio,.checkbox{
		float: left;
		width: 100%;
		padding: 20rpx;
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
		padding: 24rpx 0;
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
		margin: 30rpx auto 150rpx auto;
	}
	.course-add image{
		width: 60rpx;
		height: 60rpx;
		position: relative;
		right: 2rpx;
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
		width: 50%;
		background-color: #6666ff;
	}
	.colls{
		width: 25%;
		background-color: #6666ff;
	}
	.delet{
		width: 25%;
		background-color: #ff4d4d;
	}
	.over{
		width: 50%;
		background-color: deepskyblue;
	}
</style>
