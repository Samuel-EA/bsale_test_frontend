$(document).ready(function () {
    var parts = window.location.search.substr(1).split("&");
    var $_GET = {};
    for (var i = 0; i < parts.length; i++) {
        var temp = parts[i].split("=");
        $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }

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


    var loader = $("#loader");

     //#REGION PRODUCT_LIST AJAX
    var productList = $("#product-list");
    var title = $("#title");
    var pagination = $("#pagination");
    var previousContainer = $("#previous-container");
    var previous = $("#previous");
    var nextContainer = $("#next-container");
    var next = $("#next");
    var page = $_GET.page;
    var search = $_GET.search;
    if(page == null || page == "" || page == undefined) {
        page = 1;
    }

    $.ajax({
        url: "http://bsaletestapisamuelea-env.eba-bm2h4qb2.us-east-2.elasticbeanstalk.com/product/productSearch.php",
        data: JSON.stringify({ "records": 12, "page": page, "search" : search }),
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
            var products = response.data;
            title.text(response.total + " RESULTADOS PARA " + search.toUpperCase());
            var chileanPesoLocale = Intl.NumberFormat('es-CL');
            products.forEach(product => {
                var image;
                if(product.url_image == "" || product.url_image == undefined) {
                    image = "img/no_image_available.jpg";
                }else{
                    image = product.url_image;
                }
                productList.append("<div class='card p-3'><img src='"+ image +"' class='card-img-top' alt='"+product.name+"'><div class='card-body'><h5 class='card-title'>"+product.name+"</h5></div><div class='card-footer'><div class='row'><div class='col col-md-9'><small class='text-muted'> $"+chileanPesoLocale.format(product.price)+"</small></div><div class='col col-md-2'><a class='btn btn-primary m-2'><i class='fa-solid fa-cart-plus'></i></a></div></div></div></div>")
            });
            
            if(page == response.first || response.total == 0){
                previousContainer.addClass("disabled");
            } else {
                previous.attr("href", "search.html?page="+response.previous+"&search="+search);
            }

            if(page == response.last || response.total == 0){
                nextContainer.addClass("disabled");
            } else {
                next.attr("href", "search.html?page="+response.next+"&search="+search);
            }
            
            
            for(var i = 1; i <= response.pages; i++){
                if(i == page){
                    pagination.append("<li class='page-item active'><a class='page-link' href='search.html?page="+i+"&search="+search+"'>"+i+"</a></li>");
                }else{
                    pagination.append("<li class='page-item'><a class='page-link' href='search.html?page="+i+"&search="+search+"'>"+i+"</a></li>");
                }
            
            }
            loader.fadeToggle("fast");
            
        }
    });

    //#END REGION PRODUCT_LIST AJAX

    //#REGION CATEGORY FETCH
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
            categories.forEach(category => categoriesContainer.append("<li><a class='dropdown-item' href='category.html?category="+category.id+"'>"+category.name.toUpperCase()+"</a></li>"));
            loader.fadeToggle("fast");
            
        }
    });
    //#END REGION CATEGORY FETCH

});

//FUNCTION SEARCH
function search(){
    var search = $("#search-box").val();

    if(search == null || search == "" || search == undefined){
        alert("El campo buscar esta vacío")
    }else{
        url = "search.html?search=" + search;
        $(location).attr('href',url);
    }
}