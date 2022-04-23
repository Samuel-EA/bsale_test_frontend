$(document).ready(function () {
    //INITIALIZE LISTENERS
    document.getElementById("search-btn").addEventListener("click", function(event){
        event.preventDefault()
      });

      document.getElementById("search-box").addEventListener("keyup", function(event){
          // Number 13 is the "Enter" key on the keyboard
          if (event.keyCode === 13) {
              // Cancel the default action, if needed
              event.preventDefault();
              // Trigger the button element with a click
              search();
          }
      });

      loadResults();
      loadCategories();

});

//FUNCTION load results
function loadResults(){
    var parts = window.location.search.substr(1).split("&");
    var $_GET = {};
    for (var i = 0; i < parts.length; i++) {
        var temp = parts[i].split("=");
        $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }

    var loader = $("#loader");

     //#REGION PRODUCT_LIST AJAX
    var productList = $("#product-list");
    var title = $("#title");
    var results = $("#results");
    var pagination = $("#pagination");
    var previousContainer = $("#previous-container");
    var previous = $("#previous");
    var nextContainer = $("#next-container");
    var next = $("#next");
    var page = $_GET.page;
    var search = $_GET.search;
    var category = $_GET.category;
    if(page == null || page == "" || page == undefined) {
        page = 1;
    }
   
    if(search != null && search != undefined && search != "") {
        var url = "http://bsaletestapisamuelea-env.eba-bm2h4qb2.us-east-2.elasticbeanstalk.com/product/productSearch.php"
        var data = JSON.stringify({ "records": 12, "page": page, "search" : search });
    }else if(category != null && category != undefined && category != ""){
        var url = "http://bsaletestapisamuelea-env.eba-bm2h4qb2.us-east-2.elasticbeanstalk.com//product/getProductsByCategory.php"
        var data = JSON.stringify({ "records": 12, "page": page, "category" : category })
    }else{
        var url = "http://bsaletestapisamuelea-env.eba-bm2h4qb2.us-east-2.elasticbeanstalk.com/product/getAllProducts.php"
        var data = JSON.stringify({ "records": 12, "page": page });
    }

    $.ajax({
        url: url,
        data: data,
        type: "POST",
        contentType: "text/plain",
        crossDomain: true,
        dataType: 'json',
        processData: false,
        headers: {"Auth-Key":"bd1cf60a-d96e-417e-8a66-ceade5d684b9"},
        beforeSend: function () {
            loader.fadeToggle("fast");
        },
        success: function (response) {
            response = JSON.parse(response);
            console.log(response);
            if(search != null && search != undefined && search != ""){
                title.text(response.total + " RESULTADOS PARA " + search.toUpperCase());
            }else if(category != null && category != undefined && category != ""){
                title.text(response.total + " RESULTADOS PARA ESTA CATEGORÍA");
            }else{
                title.text("MOSTRANDO TODOS LOS RESULTADOS");
            }
            var products = response.data;
            results.text(response.total + " resultados");
            var chileanPesoLocale = Intl.NumberFormat('es-CL');
            products.forEach(product => {
                var image;
                if(product.url_image == "" || product.url_image == undefined) {
                    image = "img/no_image_available.jpg";
                }else{
                    image = product.url_image;
                }
                if(product.discount == "0" || product.discount == undefined || product.discount == null || product.discount == 0) {
                    productList.append("<div class='card p-3'><img src='"+ image +"' class='card-img-top' alt='"+product.name+"'><div class='card-body'><h5 class='card-title'>"+product.name+"</h5></div><div class='card-footer'><div class='row'><div class='col col-md-9'><small class='text-muted'> $"+chileanPesoLocale.format(product.price)+"</small></div><div class='col col-md-2'><a class='btn btn-primary m-2'><i class='fa-solid fa-cart-plus'></i></a></div></div></div></div>");
                }else{
                    discountPrice = product.price - (product.price * product.discount) / 100;
                    productList.append("<div class='card p-3'><img src='"+ image +"' class='card-img-top' alt='"+product.name+"'><div class='card-body'><h5 class='card-title'>"+product.name+"</h5></div><div class='card-footer'><div class='row'><div class='col col-md-9'><del class='text-muted'> $"+chileanPesoLocale.format(product.price)+"</del><br><small class='text-muted'> $"+chileanPesoLocale.format(discountPrice)+"</small></div><div class='col col-md-2'><a class='btn btn-primary m-2'><i class='fa-solid fa-cart-plus'></i></a></div></div></div></div>");
                }
            });
            //NEXT AND PREVIOUS BUTTON
            if(page == response.first){
                previousContainer.addClass("disabled");
            } else {
                previousContainer.removeClass("disabled");
                var linkPrevious = "";
                if(search != null && search != undefined && search != ""){
                    linkPrevious = 'reloadWithoutRefresh("index.html?page='+response.previous+'&search='+search+'")';
                }else if(category != null && category != undefined && category != ""){
                    linkPrevious = 'reloadWithoutRefresh("index.html?page='+response.previous+'&category='+category+'")';
                }else{
                    linkPrevious = 'reloadWithoutRefresh("index.html?page='+response.previous+'")';
                }
                previous.attr("onclick", linkPrevious);
            }

            if(page == response.last){
                nextContainer.addClass("disabled");
            } else {
                nextContainer.removeClass("disabled");
                var linkNext = "";
                if(search != null && search != undefined && search != ""){
                    linkNext = 'reloadWithoutRefresh("index.html?page='+response.next+'&search='+search+'")';
                }else if(category != null && category != undefined && category != ""){
                    linkNext = 'reloadWithoutRefresh("index.html?page='+response.next+'&category='+category+'")';
                }else{
                    linkNext = 'reloadWithoutRefresh("index.html?page='+response.next+'")';
                }
                next.attr("onclick", linkNext);
            }
            
            //PAGINATION BUTTONS
            for(var i = 1; i <= response.pages; i++){
                if(search != null && search != undefined && search != ""){
                    var link = 'reloadWithoutRefresh("index.html?page='+i+'&search='+search+'")';
                }else if(category != null && category != undefined && category != ""){
                    var link = 'reloadWithoutRefresh("index.html?page='+i+'&category='+category+'")';
                }else{
                    var link = 'reloadWithoutRefresh("index.html?page='+i+'")';
                }
                if(i == page){
                    pagination.append("<li class='page-item active'><a class='page-link' onclick='"+link+"'>"+i+"</a></li>");
                }else{
                    pagination.append("<li class='page-item'><a class='page-link' onclick='"+link+"'>"+i+"</a></li>");
                }
            
            }
            loader.fadeToggle("fast");
            
        }
    });
}

//FUNCTION LOAD CATEGORIES

function loadCategories(){
    //#REGION CATEGORY FETCH
    var loader = $("#loader");
    var categoriesContainer = $("#categories");
    $.ajax({
        url: "http://bsaletestapisamuelea-env.eba-bm2h4qb2.us-east-2.elasticbeanstalk.com/category/getCategories.php",
        type: "GET",
        contentType: "text/plain",
        crossDomain: true,
        dataType: 'json',
        processData: false,
        headers: {"Auth-Key":"bd1cf60a-d96e-417e-8a66-ceade5d684b9"},
        beforeSend: function () {
            loader.fadeToggle("fast");
        },
        success: function (response) {
            console.log(response);
            var categories = response.data;
            categories.forEach(category => {
                var link = 'reloadWithoutRefresh("index.html?category='+category.id+'")';
                categoriesContainer.append("<li><a class='dropdown-item' href='#' onclick='"+link+"'>"+category.name.toUpperCase()+"</a></li>")
            });
            loader.fadeToggle("fast");
            
        }
    });
    //#END REGION CATEGORY FETCH
}

//FUNCTION reload with no refresh
function reloadWithoutRefresh(url){
    var productList = $("#product-list");
    var pagination = $("#pagination");
    if(url == null || url == "" || url == undefined){
        alert("Intentas cargar una página que no existe");
    }else{
        productList.html("");
        pagination.html("");
        window.history.pushState('search', "BSALE TEST FRONTEND", url);
        loadResults();
    }
}

//FUNCTION SEARCH
function search(){
    var productList = $("#product-list");
    var pagination = $("#pagination");
    var search = $("#search-box").val();
    if(search == null || search == "" || search == undefined){
        alert("El campo buscar esta vacío")
    }else{
        productList.html("");
        pagination.html("");
        url = "index.html?search=" + search;
        window.history.pushState('search', "BSALE TEST FRONTEND", url);
        loadResults();
    }
}

$(window).on("popstate", function(e) {
    var productList = $("#product-list");
    var pagination = $("#pagination");
    productList.html("");
    pagination.html("");
    loadResults();
});