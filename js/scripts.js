// IIFE Immediately Invoked Function Expression
var pokemonRepository = (function() {
  var repository = [];

  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; // link for loading pokeapi

  function getAll() {
    return repository;
  }

  function add(pokemon) {
    if (typeof pokemon === 'object') {
      repository.push(pokemon);
    } else {
      console.log('only objects with predetermined keys can be added!');
    }
  }

  // function for fetching data from API - jQuery: ajax()
  function loadList() {
    return $.ajax(apiUrl, { dataType: 'json' })
      .then(function(item) {
        $.each(item.results, function(i, item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  // function which loads details about pokemon that are later displayed in modal
  function loadDetails(item) {
    var $url = item.detailsUrl;
    return $.ajax($url)
      .then(function(details) {
        // details are added to the item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = item.types = details.types.map(function(pokemon) {
          return ' ' + pokemon.type.name;
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  // addListItem function written by exchanging querySelector with jQuery
  //created list with buttons that have pokemons' names on it
  function addListItem(pokemon) {
    var $pokelist = $('.pokemon-list');
    var $listItem = $(
      '<button type="button" class="list-group-item list-group-item-action" data-toggle="modal" data-target=".modal"></button>'
    ).text(pokemon.name[0].toUpperCase() + pokemon.name.slice(1));
    $pokelist.append($listItem);
    $listItem.on('click', function(event) {
      showDetails(pokemon);
    });
  }

  //showDetails function shows pokemon's details in a modal after clicking on pokemons name
  function showDetails(item) {
    // creating Bootstrap's modal
    var $modalContainer = $('#modal-container');
    var $modal = $(
      '<div class="modal" tabindex="-1" role="dialog" aria-labelledby="pokemon-name" aria-hidden="true">'
    );
    var $modalDialog = $('<div class="modal-dialog" role="document"></div>');
    var $modalContent = $('<div class="modal-content"></div>');
    var $modalHeader = $('<div class="modal-header"></div>');
    var $modalTitle = $('<h5 class="modal-title" id="pokemon-name"></h5>');
    var $closeButton = $(
      '<button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    );
    var $modalBody = $('<div class="modal-body"></div>');
    var $modalFooter = $('<div class="modal-footer"></div');
    var $primaryButton = $(
      '<button type="button" class="btn btn-info modal-close modal-close__button" data-dismiss="modal">Close</button>'
    );

    // creating elements for displaying content
    var $nameElement = $modalTitle.text(
      item.name[0].toUpperCase() + item.name.slice(1)
    );
    var $imageElement = $(
      '<img class="pokemon-img" alt="a picture of current pokemon">'
    ).attr('src', item.imageUrl);
    var $heightElement = $('<p class="pokemon-height"></p>').text(
      'Height: ' + item.height
    );
    var $typesElement = $('<p class="pokemon-types"></p>').text(
      'Types: ' + item.types
    );
    console.log(item);

    // Appending modal and its content to page

    $modalTitle.append($nameElement);
    $modalBody.append($imageElement);
    $modalBody.append($heightElement);
    $modalBody.append($typesElement);
    $modalFooter.append($primaryButton);

    $modalHeader.append($modalTitle);
    $modalHeader.append($closeButton);

    $modalContent.append($modalHeader);
    $modalContent.append($modalBody);
    $modalContent.append($modalFooter);

    $modalDialog.append($modalContent);
    $modal.append($modalDialog);
    $modalContainer.append($modal);
    // reset content of modal after closing
    $('.modal-close').click(function() {
      $('.modal-backdrop').remove();
      $modalContainer.empty();
      $('body').removeClass('modal-open');
    });
  }

  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

pokemonRepository.loadList().then(function() {
  $.each(pokemonRepository.getAll(), function(index, pokemon) {
    pokemonRepository.loadDetails(pokemon);
    pokemonRepository.addListItem(pokemon);
  });
});

// function for filter/search pokemon list by name
$(document).ready(function() {
  $('#pokemon-search').on('keyup', function() {
    var value = $(this)
      .val()
      .toLowerCase();
    $('.list-group-item').filter(function() {
      $(this).toggle(
        $(this)
          .text()
          .toLowerCase()
          .indexOf(value) > -1
      );
    });
  });
});
