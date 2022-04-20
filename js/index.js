$(document).ready(function () {
    var parts = window.location.search.substr(1).split("&");
    var $_GET = {};
    for (var i = 0; i < parts.length; i++) {
        var temp = parts[i].split("=");
        $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }

    var loader = $("#loader");

     //#REGION PRODUCT_LIST AJAX
    var productList = $("#product-list");
    var results = $("#results");
    var pagination = $("#pagination");
    var previousContainer = $("#previous-container");
    var previous = $("#previous");
    var nextContainer = $("#next-container");
    var next = $("#next");
    var page = $_GET.page;
    if(page == null || page == "" || page == undefined) {
        page = 1;
    }

    $.ajax({
        url: "http://localhost/api/product/paginate.php",
        data: JSON.stringify({ "records": 12, "page": page }),
        type: "POST",
        contentType: "text/plain",
        crossDomain: true,
        dataType: 'json',
        processData: false,
        beforeSend: function () {
            loader.fadeToggle("fast");
        },
        success: function (response) {
            response = JSON.parse(response);
            console.log(response);
            var products = response.data;
            results.text(response.total + " resultados");
            var chileanPesoLocale = Intl.NumberFormat('es-CL');
            products.forEach(product => productList.append("<div class='card p-3'><img src='"+product.url_image+"' class='card-img-top' alt='"+product.name+"'><div class='card-body'><h5 class='card-title'>"+product.name+"</h5></div><div class='card-footer'><div class='row'><div class='col col-md-9'><small class='text-muted'> $"+chileanPesoLocale.format(product.price)+"</small></div><div class='col col-md-2'><a class='btn btn-primary m-2'><i class='fa-solid fa-cart-plus'></i></a></div></div></div></div>"));
            
            if(page == response.first){
                previousContainer.addClass("disabled");
            } else {
                previous.attr("href", "index.html?page="+response.previous);
            }

            if(page == response.last){
                nextContainer.addClass("disabled");
            } else {
                next.attr("href", "index.html?page="+response.next);
            }
            
            
            for(var i = 1; i <= response.pages; i++){
                if(i == page){
                    pagination.append("<li class='page-item active'><a class='page-link' href='index.html?page="+i+"'>"+i+"</a></li>");
                }else{
                    pagination.append("<li class='page-item'><a class='page-link' href='index.html?page="+i+"'>"+i+"</a></li>");
                }
            
            }
            loader.fadeToggle("fast");
            
        }
    });

    //#END REGION PRODUCT_LIST AJAX

    //#REGION CATEGORY FETCH
    var categories = $("#categories");
    $.ajax({
        url: "http://localhost/api/category/getCategories.php",
        type: "GET",
        contentType: "text/plain",
        crossDomain: true,
        dataType: 'json',
        processData: false,
        beforeSend: function () {
            loader.fadeToggle("fast");
        },
        success: function (response) {
            console.log(response);
            //response.forEach(category => categories.append("<li><a class='dropdown-item' href='category.html?id="+category.id+"'>"+category.name.toUpperCase()+"</a></li>"));
            loader.fadeToggle("fast");
            
        }
    });
    //#END REGION CATEGORY FETCH

});