import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core'
import { InstantSearch, Configure, Index } from 'react-instantsearch/dom';
import { connectAutoComplete } from 'react-instantsearch/connectors';
import algoliaClient from 'algoliasearch/src/browser/builds/algoliasearch'
import Autosuggest from 'react-autosuggest';

const PostsSearchAutoComplete = ({clickAction}) =>
  <InstantSearch
    indexName="test_posts"
    algoliaClient={algoliaClient("Z0GR6EXQHD", "0b1d20b957917dbb5e1c2f3ad1d04ee2")}
  >
    <div className="posts-search-auto-complete">
      <AutoComplete clickAction={clickAction}/>
      <Configure hitsPerPage={3} />
    </div>
  </InstantSearch>;

const AutoComplete = connectAutoComplete(
  ({ hits, currentRefinement, refine, clickAction }) =>
    <Autosuggest
      suggestions={hits}
      onSuggestionsFetchRequested={({ value }) => refine(value)}
      onSuggestionsClearRequested={() => refine('')}
      getSuggestionValue={hit => hit.title}
      renderSuggestion={hit =>
        <Components.PostsSearchHit hit={hit} clickAction={clickAction} />}
      inputProps={{
        placeholder: 'Type a product',
        value: currentRefinement,
        onChange: () => {},
      }}
      highlightFirstSuggestion
    />
);

registerComponent("PostsSearchAutoComplete", PostsSearchAutoComplete);