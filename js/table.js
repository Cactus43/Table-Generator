var tables = new Map();
var sources = new Map();

function table_composer(id, name, url, table_dim, scrollable, col_dim, nav){
  sources.set("table_"+id, url);
  //console.log(sources);
    fetch(url).then(onResponse).then(function onJSON_fill_table(json){
        table_filler(id, name, json, table_dim, scrollable, col_dim, nav);
    });
}

    function table_filler(id, name, data, table_dim, scrollable, col_dim, nav){
		if(name!=null && name!=""){
        var title = document.createElement("h1");
        title.setAttribute("id","title_table_"+id);
        title.innerHTML = name;
        }
        //alert(title.textContent);

        $('#'+id).append(title);
        var box_content = document.createElement("div");
        box_content.setAttribute("class","box-content");
        box_content.setAttribute("id","box-content_"+id);
		if(table_dim!=null && table_dim!='' && table_dim>0){
			//box_content.setAttribute("style","max-width: "+table_dim+"px;");
			
			if(scrollable==true){
				box_content.setAttribute("style","max-width: "+table_dim+"px;"+"overflow-x: scroll;");
			}else{
				box_content.setAttribute("style","max-width: "+table_dim+"px;"+"overflow-x: hidden;");
			}
		}else{
			if(scrollable==true){
				box_content.setAttribute("style","overflow-x: scroll;");
			}else{
				box_content.setAttribute("style","overflow-x: hidden;");
			}
		}
        if(nav==true){
          var table_nav = document.createElement("div");
          table_nav.setAttribute("class","table-nav");
          table_nav.setAttribute("id","table_nav_"+id);

          var reload_button = document.createElement("button");
		  if(table_dim!=null && table_dim!='' && table_dim>0){
			  reload_button.setAttribute("data-table-dim", table_dim);
		  }
		  if(scrollable==true){
			  reload_button.setAttribute("data-table-scroll", scrollable);
		  }
          //reset_button.setAttribute("id","table_nav_reset_button_"+id);
          reload_button.setAttribute("class","table-nav-reload-button");
          reload_button.setAttribute("data-table-nav-reload-button","table_"+id);
          reload_button.innerHTML = "Reload Table";



          var search_bar = document.createElement("input");
          search_bar.setAttribute("type","text");
          search_bar.setAttribute("placeholder","Type to Search");
          search_bar.setAttribute("class","table-nav-search-bar");
          //search_bar.setAttribute("id","table_nav_searchbar_"+id);
          search_bar.setAttribute("data-table-nav-searchbar","table_"+id);

          table_nav.append(reload_button);
          table_nav.append(search_bar);

          $('#'+id).append(table_nav);
        }
        $('#'+id).append(box_content);

        
        var table = document.createElement("div");
        table.setAttribute("class","table");
        table.setAttribute("id","table_"+id);
        
        $('#'+"box-content_"+id).append(table);

        tables.set("table_"+id,data);
        data_printer("table_"+id, data, col_dim, '', 'default');
    }
    

    function head_printer(id, col_dim, field, order){
      //console.log(dim);
      var head = document.createElement("div");
        head.setAttribute("class","head row");
   
        var data = tables.get(id);
        //console.log(data[0]);
        var keys = Object.keys(data[0]);
        for(var i=0; i<keys.length; i++){
            //var key = keys[i];
            var cell = document.createElement("div");
            if(col_dim.length==keys.length){
              cell.setAttribute("class","cell "+"w-"+col_dim[i]);
              cell.setAttribute("data-table-head-dim",col_dim[i]);
            }else{
              cell.setAttribute("class","cell");
              cell.setAttribute("data-table-head-dim",'');
            }
            cell.setAttribute("data-table-head",id);
            cell.innerHTML = keys[i];
            if(field == keys[i]){
              cell.setAttribute("data-table-order", order);
              if(order=="asc"){
                cell.setAttribute('style', 'background-image: url(img/icons/sort_asc.svg);');
              }else if(order=="desc"){
                cell.setAttribute('style', 'background-image: url(img/icons/sort_desc.svg);');
              }
            }else{
              cell.setAttribute("data-table-order", 'default');
              cell.setAttribute('style', 'background-image: url(img/icons/sort_default.svg);');
            }
            head.appendChild(cell);
            //console.log(key);
        }
        $('#'+id).append(head);
    }
    
    function data_printer(id, data, col_dim, field, order){

        head_printer(id, col_dim, field, order);
  
  
        for(dat of data){
          var row = document.createElement("div");
          row.setAttribute("class","row");
          row.setAttribute("data-table-row",id);
          var keys = Object.keys(dat);
          for(var i=0; i<keys.length; i++){
            //var key = keys[i];
            var cell = document.createElement("div");
            cell.setAttribute("data-table-field",keys[i]);
            cell.setAttribute("data-table-row-cell",id);
            cell.setAttribute("data-table-row-cell-value",dat[keys[i]]);

            if(col_dim.length==keys.length){
              cell.setAttribute("class","cell "+"w-"+col_dim[i]);


              if(dat[keys[i]]==null || dat[keys[i]]=='null'){
                cell.setAttribute("class","cell "+"w-"+col_dim[i]+" null");
                dat[keys[i]] = 'null';
                //cell.innerHTML = 'null'
              }else{
              cell.setAttribute("class","cell "+"w-"+col_dim[i]);
              }
            }else{
              if(dat[keys[i]]==null || dat[keys[i]]=='null'){
                cell.setAttribute("class","cell "+" null");
                dat[keys[i]] = 'null';
                //cell.innerHTML = 'null'
              }else{
                cell.setAttribute("class","cell");
              }
            }


            
            cell.innerHTML = dat[keys[i]];
            row.appendChild(cell);
            //console.log(key);
        }
        
        $('#'+id).append(row);
  
        }
      }
  
      function onResponse(response){
        return response.json();
      }

    
        $( document ).ready(function() {
$('body').on('click', '.cell', function(){
  if($(this).parent().prop('class')=="head row"){
      let map;
      let order="";
      if($(this).attr('data-table-order')=='default' || $(this).attr('data-table-order')=='desc'){
        order = 'asc';
        map = tables.get($(this).attr('data-table-head')).sort(ASC_sort($(this).text()));


      }else if($(this).attr('data-table-order')=='asc'){
        order = 'desc';
        map = tables.get($(this).attr('data-table-head')).sort(DESC_sort($(this).text()));

      }
       // console.log(map);

       let dim = new Array();

       let head = document.querySelectorAll('[data-table-head = "'+$(this).attr('data-table-head')+'"]');
       //console.log(head);
       for(d of head){
         dim.push(d.getAttribute('data-table-head-dim'));
       }
       //console.log(dim);

        $('#'+$(this).attr('data-table-head')).html("");
        data_printer($(this).attr('data-table-head'), map, dim, $(this).text(), order);
    }
    });
    
    $('body').on('keyup', '.table-nav-search-bar', function(){
          //alert($(this).val());
          let map = new Array();
          for(dat of tables.get($(this).attr('data-table-nav-searchbar'))){
            var keys = Object.keys(dat);
            for(var i=0; i<keys.length; i++){
              if(dat[keys[i]]!=null && dat[keys[i]].toLowerCase().includes($(this).val())){
                map.push(dat);
                break;
              }
            }
          }

          let dim = new Array();

            let head = document.querySelectorAll('[data-table-head = "'+$(this).attr('data-table-nav-searchbar')+'"]');
            //console.log(head);
            for(d of head){
              dim.push(d.getAttribute('data-table-head-dim'));
            }
            //console.log(dim);

            //console.log(map);
            $('#'+$(this).attr('data-table-nav-searchbar')).html("");
            data_printer($(this).attr('data-table-nav-searchbar'), map, dim, $(this).text(), 'defaults');
        });

        $('body').on('click', '.table-nav-reload-button', function(){

          let col_dim = new Array();

          let head = document.querySelectorAll('[data-table-head = "'+$(this).attr('data-table-nav-reload-button')+'"]');
          //console.log(head);
          for(d of head){
            col_dim.push(d.getAttribute('data-table-head-dim'));
          }

          title = $('#title_'+$(this).attr('data-table-nav-reload-button')).text();
          $('#'+$(this).attr('data-table-nav-reload-button').replace('table_','')).html("");
          //console.log($(this).attr('data-table-nav-reload-button'));
          //console.log(sources.get($(this).attr('data-table-nav-reload-button')));
		  let scrollable;
		  if($(this).attr('data-table-scroll')=="true"){
			  scrollable=true;
		  }else if($(this).attr('data-table-scroll')=="false"){
			  scrollable=false;
		  }
          table_composer($(this).attr('data-table-nav-reload-button').replace('table_',''),title,sources.get($(this).attr('data-table-nav-reload-button')),$(this).attr('data-table-dim'),scrollable,col_dim,true);
        });

  });

        function ASC_sort(prop) {
    return function(a, b) {

        if(a[attrName] === undefined || b[attrName] === undefined){
            return 0;
        }

        if( (a === true && b === false) ){
            return 1;
        }else if (  (a === true && b === true) || (a === false && b === false) ) {
            return 0;
        }else if( a === false && b === true ){
            return -1
        }

        let temp_a, temp_b;

        if(isNaN(a[attrName])){
            temp_a = a[attrName].toLowerCase().replaceAll(' ', '');
        }else{
            temp_a = a[attrName];
        }
        if(isNaN(b[attrName])){
            temp_b = b[attrName].toLowerCase().replaceAll(' ', '');
        }else{
            temp_b = b[attrName];
        }

        if ((temp_a > temp_b) || temp_b == null || temp_b == '') {
            //console.log(a[prop].toLowerCase().replaceAll(' ', '') +" | > | "+ b[prop].toLowerCase().replaceAll(' ', ''))

            return 1;
        } else if ((temp_a < temp_b) || temp_a == null || temp_a == '') {
            //console.log(a[prop].toLowerCase().replaceAll(' ', '') +" | < | "+ b[prop].toLowerCase().replaceAll(' ', ''))

            return -1;
        }
        return 0;
    }
}

        function DESC_sort(prop) {
    return function(a, b) {
        
        if(a[attrName] === undefined || b[attrName] === undefined){
            return 0;
        }

        if( (a === true && b === false) ){
            return -1;
        }else if (  (a === true && b === true) || (a === false && b === false) ) {
            return 0;
        }else if( a === false && b === true ){
            return 1
        }

        let temp_a, temp_b;

        if(isNaN(a[attrName])){
            temp_a = a[attrName].toLowerCase().replaceAll(' ', '');
        }else{
            temp_a = a[attrName];
        }
        if(isNaN(b[attrName])){
            temp_b = b[attrName].toLowerCase().replaceAll(' ', '');
        }else{
            temp_b = b[attrName];
        }

        if ((temp_a > temp_b) || temp_b == null || temp_b == '') {
            //console.log(a[prop].toLowerCase().replaceAll(' ', '') +" | > | "+ b[prop].toLowerCase().replaceAll(' ', ''))

            return -1;
        } else if ((temp_a < temp_b) || temp_a == null || temp_a == '') {
            //console.log(a[prop].toLowerCase().replaceAll(' ', '') +" | < | "+ b[prop].toLowerCase().replaceAll(' ', ''))

            return 1;
        }
        return 0;
    }
}  
