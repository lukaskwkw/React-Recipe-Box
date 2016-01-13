'use strict';

import  React from "react";
import  ReactDOM from "react-dom";

class RecipeBox extends React.Component {
	constructor() {
		super();
		this.renderRecipes = this.renderRecipes.bind(this);
		this.panelClick = this.panelClick.bind(this);
		this.renderImages = this.renderImages.bind(this);
		this.removeRecipe = this.removeRecipe.bind(this);
		this.saveRecipe = this.saveRecipe.bind(this);
		this.editClick = this.editClick.bind(this);
		let recipes = localStorage.recipes;
		if (recipes && recipes.length>2){
			let parsedRecipes = JSON.parse(recipes);
			// set all panel-bodies to download images after each panel click (not immediately)
			let keys = Object.keys(parsedRecipes);
			for (let i = 0; i < keys.length; i++) {
				parsedRecipes[keys[i]].download =false;
			}
			this.state = {'recipes' : parsedRecipes};
		}
		else{
			this.state = {
				'recipes' : 
				{
					'0' : 
					{ 'name' : 'Full Pita', 'description' : 'Place pitas into hoven at 200C for 5-7 min (Before sprinkle them with water). After pitas grows put all other ingredients inside them', 
					'ingredients' : ['red/green/yellow peper','leaf os salad','tofu','hummus souce','tomatoes x2'],
					'main' : 'http://lorempixel.com/800/500/food/1/',
					'images' : ['http://lorempixel.com/400/200/food/5/','http://lorempixel.com/400/200/food/8/','http://lorempixel.com/400/200/food/3/'],
					'download' : false
				},
				'1' : 
				{ 'name' : 'Energy breakfast', 
				'description' : 'A bowl of rice with fruits carbs. Prepare and cook rice, soak dates in water for 10-15min. After rice will be ready wait some time when it cool down little bit (10-15min) Mix with other ingredients.', 
				'ingredients' : ['rice 150g, bananas x1-2','dates 4-5','Carob or Cacao','wallnuts 10-15g'],
				'main' : 'http://lorempixel.com/800/500/food/2/',
				'images' : ['http://lorempixel.com/400/200/food/6/', 'http://lorempixel.com/400/200/food/4/'],
				'download' : false
			},
			'2' : 
			{ 'name' : 'Lentils chops', 
			'description' : 'Lentils chops. Cook your lentil. Wait afet its cool down. Mix cooked and cooled lentil with grated carrots and cloves of garlic. Form into chops. Cover them with bread cumbs and flour, put into pan and wait when them will be ready', 
			'ingredients' : ['2-3 cloves of garlic','lentil 500g','bread crumbs','flour','carrot x2-3'],
			'main' : 'http://lorempixel.com/800/500/food/3/',
			'images' : ['http://lorempixel.com/400/200/food/7/'],
			'download' : false
		},
		'3' : 
		{ 'name' : 'Avocado toasts',
		'description' : 'Fried toasts with avocado. Fry toasts in oven or pan-fry with little olive', 
		'ingredients' : ['x1-2 avocado','toasts','pepper','salt'],
		'main' : 'http://lorempixel.com/800/500/food/4/',
		'images' : ['http://lorempixel.com/400/200/food/8/','http://lorempixel.com/400/200/nature/8/','http://lorempixel.com/400/200/nature/2/'],
		'download' : false
	}
}
}
}


}
	panelClick (e)  {
		let next = e.currentTarget.nextSibling;
		if (this.state.recipes[e.currentTarget.id].download === false){
				this.state.recipes[e.currentTarget.id].download = true;
				this.forceUpdate();
			}
		let pb = document.querySelectorAll('.panel-body');
		next.scrollTop = 0;

		next.classList.toggle('slideDown');
		for (let i = 0; i < pb.length; i++) {
			if (pb[i]!==next)
				pb[i].classList.remove('slideDown');
		}
	}
	renderImages(key, main) {
		let lazyLoad = function(img){
			let div = document.querySelector('[data-src="'+img.src+'"]');
			if (!div) 
				return;
			div.parentElement.replaceChild(img, div);
		}
		let elem = this.state.recipes[key];
		if (elem.download===true) {
			if (main && elem.main){		//if it's main image render only 1
				let img = new Image();
				img.src = elem.main;
				img.width = 400;
				img.height = 200;
				img.classList.add('img-responsive');
				img.onload = () => {lazyLoad(img)}
				return <div className="wrapper" data-src={img.src}>
				<div className="cssload-loader"></div>
				</div>
			}
			else{
				let domTree = [];
				if (elem.images)
					for (let i = 0; i < elem.images.length; i++) {
						let img = new Image();
						img.src = (elem.images[i]) ? elem.images[i] : 'http://placehold.it/400x200.jpg';
						img.width=225;
						img.height=225;
						img.style.height = 'auto';
						img.onload = () => {lazyLoad(img)}
						domTree.push(<div key={i} className="wrapper" data-src={img.src}>
							<div className="cssload-loader"></div>
							</div>)
					}
					return domTree;
				}
			}
		}
	saveRecipe(id,obj_Recipe){
		let recipes = this.state.recipes;

		if (id===null) { //new recipe
		let last = Object.keys(recipes).length-1;
		recipes[last+1] = obj_Recipe;
		}
		else //we want update
		recipes[id] = obj_Recipe;

		this.setState({'recipes':recipes});
		localStorage.recipes = JSON.stringify(this.state.recipes);

		//close all modals
		let pb = document.querySelectorAll('.panel-body');
		for (let i = 0; i < pb.length; i++) {
				pb[i].classList.remove('slideDown');
		}

	}
	removeRecipe(e){
		e.stopPropagation();
		let recipe = e.currentTarget.parentElement.id;
		delete this.state.recipes[recipe];
		this.forceUpdate();
		localStorage.recipes = JSON.stringify(this.state.recipes);
	}
	editClick(e)
	{
		let dataId = e.target.getAttribute('data-id');
		let elem = this.state.recipes[dataId];
		let modal = this.refs.modal;
		modal.setState({
			action:'Update',
			id:dataId,
			name:elem.name, 
			description : elem.description,
			ingredients : elem.ingredients.join(','),
			main : elem.main,
			images : elem.images,
			urlInputs : elem.images.length
		});	
		modal.showModal();
	}
	renderRecipes() {
		let keys = Object.keys(this.state.recipes);
		let tree=[];
		for (let i = 0; i < keys.length; i++) {
			let ingredients = [];
			let recipe = this.state.recipes[keys[i]];
			for (let j = 0; j < recipe.ingredients.length; j++)
			{
				ingredients.push(<li key={recipe.ingredients[j]} className="list-group-item ingredients">{recipe.ingredients[j]}</li>)
			}
			tree.push(<div key={keys[i]} className="panel panel-primary" >

				<div className="panel-heading" id={keys[i]} onClick={this.panelClick}>{recipe.name}
				<div className="delete glyphicon glyphicon-remove" onClick={this.removeRecipe}></div></div>
						<div className="panel-body" >
							<div className="main-image">{this.renderImages(keys[i],'main')}</div>
							<input type="button" className="btn btn-warning btn-xs edit" data-id={keys[i]} value="edit recipe" onClick={this.editClick}/>
							<h2>Description</h2>	
							<div className="description">{recipe.description}</div>
								<h2>Ingredients</h2>
								<ul className="list-group">
									{ingredients}
								</ul>
								<div className="images-container">{this.renderImages(keys[i])}</div>
							</div>
						</div>)
		}
		return tree;
	}
	render() {
		return (
			<div>
					{this.renderRecipes()}
					<Modal ref="modal" passRecipe={this.saveRecipe} />
		</div>
		);
	}
}






//////////////////////////
//MODAL AND ITS trigger //
//////////////////////////



class Modal extends React.Component {
	constructor() {
		super();
		this.showModal = this.showModal.bind(this);
		this.renderInputs = this.renderInputs.bind(this);
		this.addRecipe = this.addRecipe.bind(this);
		this.closeModal = this.closeModal.bind(this);

		this.state = {'action':'Add recipe','urlInputs':1,'id' : null, 'name':'','description':'','ingredients':'','main':'','images':[]};
	}

	closeModal(animateOut="bounceOutLeft"){
			let wrapper_modal = document.querySelector('.wrapper_modal');
			let myModal = wrapper_modal.nextSibling;
			myModal.classList.remove("fadeInDown");
			myModal.classList.remove("bounceInLeft");
			setTimeout(()=>wrapper_modal.style.display='none',500);
			myModal.classList.add(animateOut);
					this.setState({
			action:'Add recipe',
			id: null,
			name:'', 
			description : '',
			ingredients : '',
			main : '',
			images : [],
			urlInputs : 1
		});	

	}
	showModal(animateIn='bounceInLeft',animateOut='bounceOutLeft'){
		let wrapper_modal = this.refs.wrapper_modal;
		let myModal = this.refs.my_modal;
		myModal.classList.remove('bounceOutRight');
		myModal.classList.remove(animateOut);
		wrapper_modal.style.display='block';
		myModal.classList.add(animateIn);
		myModal.style.display = 'block';
	}
	addRecipe() {
		let  id = this.state.id;
		let  name = this.state.name;
		let  description = this.state.description;
		let  ingredients = this.state.ingredients;
		let  images = this.state.images;
		let  main = this.state.main;

		let obj_Recipe = {
			name : name,
			description : description,
			ingredients : ingredients.split(',').map(e=>e.trim()),
			main : main,
			images : images,
			download : false
		}
		this.props.passRecipe(id, obj_Recipe);
		this.closeModal('bounceOutRight');
	}
	renderInputs()
	{
		let urlInputOnChange = function(i,e){
			let images = this.state.images;
			images[i] = e.target.value;
			this.setState({images : images}) 
		}

		urlInputOnChange = urlInputOnChange.bind(this); 
		let inputs = [];
		for (let i = 0; i < this.state.urlInputs; i++) {
			inputs.push(<input key={i} type="text" className="url" placeholder="Additional small image" onChange={(e)=>urlInputOnChange(i,e)} value={this.state.images[i]}/>)
		}
		return <div>
		<label htmlFor="url">More images</label>
		{inputs}
		</div>
	}
	render() {
		return (
			<div className="new-recipe">
				<div ref="wrapper_modal" className="wrapper_modal animated" onClick={()=>this.closeModal()} ></div>
					<div ref="my_modal" className="my_modal animated">
						<span className='crossMark glyphicon glyphicon-remove' onClick={()=>this.closeModal()} ></span>
						<h3 className="modal-heading">{( ()=> {return (this.state.action==='Add recipe') ? (this.state.name==='') ? 'New Recipe' : this.state.name : this.state.name})()}</h3>
						<div className="modal-body">
							<label htmlFor="name">Recipe</label>
							<br/>
							<input type="text" id="name" placeholder="Recipe name" onChange={(e)=> this.setState({'name' : e.target.value}) } value={ (this.props.editedRecipe) ? this.state.name || this.props.editedRecipe.name : this.state.name}/>
							<br/>
							<label htmlFor="description">Description</label>
							<br/>
							<textarea name="description" id="description" cols="30" rows="4" placeholder="Recipe description" onChange={(e)=> this.setState({'description' : e.target.value}) } value={this.state.description}></textarea>
							<br/>
							<label htmlFor="ingredients">Ingredients</label>
							<br/>
							<textarea name="ingredients" id="ingredients" cols="30" rows="4" placeholder="Put ingredients separeted by commas" onChange={(e)=> this.setState({'ingredients' : e.target.value}) }  value={this.state.ingredients}></textarea>
							<br/>
							<label htmlFor="url">Main Image</label>
							<br/>
							<input type="text" className="url" placeholder="Url to your heading image" onChange={(e)=> this.setState({'main' : e.target.value}) } value={this.state.main}/>
							<br/>
							{this.renderInputs()}
							<input type="button" className="btn btn-primary btn-xs" id="add-input" value="Add Image" onClick={() => this.setState({'urlInputs':this.state.urlInputs+1})}/>
							<br/>
						</div>
						<div className="modal-footer">
							<input type="button" className="btn btn-success" id="add-recipe" value={this.state.action} onClick={this.addRecipe}/>
							<input type="button" className="btn-cancel btn btn-danger"  onClick={()=>this.closeModal()} value="Cancel"/>
						</div>
					</div>
				
				<input type="button" className="btn btn-success new-btn" value="New Recipe" onClick={()=>this.showModal()}/>
			</div>
		);
	}
}




ReactDOM.render(<RecipeBox/>,document.getElementById('content'));
