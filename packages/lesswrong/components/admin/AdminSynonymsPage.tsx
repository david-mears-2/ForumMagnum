import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { registerComponent, Components } from "../../lib/vulcan-lib";
import { gql, useQuery, useMutation } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const searchSynonymsQuery = gql`
  query SearchSynonyms {
    SearchSynonyms
  }
`;

const searchSynonymsMutation = gql`
  mutation UpdateSearchSynonyms($synonyms: [String!]!) {
    UpdateSearchSynonyms(synonyms: $synonyms)
  }
`;

const styles = (theme: ThemeType) => ({
  root: {
    fontFamily: theme.palette.fonts.sansSerifStack,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  buttons: {
    display: "flex",
    gap: "6px",
    "& MuiButton-root": {
      textTransform: "none",
    },
  },
});

const AdminSynonymsPage = ({classes}: {
  classes: ClassesType,
}) => {
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const {data, loading, error} = useQuery(searchSynonymsQuery);
  const [updateSearchSynonyms, updateLoading] = useMutation(
    searchSynonymsMutation,
    {errorPolicy: "all"},
  );

  useEffect(() => {
    setSynonyms(data.SearchSynonyms ?? []);
  }, [data]);

  const onEditSynonym = useCallback((index: number) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const newSynonyms = [...synonyms];
      newSynonyms[index] = event.target.value;
      setSynonyms(newSynonyms);
    };
  }, [synonyms]);

  const onAddSynonym = useCallback(() => {
    setSynonyms([...synonyms.filter((synonym) => synonym), ""]);
  }, [synonyms]);

  const onSave = useCallback(async () => {
    const validSynonyms = synonyms.filter((synonym) => synonym?.indexOf(","));
    const result = await updateSearchSynonyms({
      variables: {
        synonyms: validSynonyms,
      },
    });
    setSynonyms(result?.data?.UpdateSearchSynonyms);
  }, [synonyms, updateSearchSynonyms]);

  const isLoading = loading || updateLoading?.loading;

  const {SingleColumnSection, SectionTitle, Loading} = Components;
  return (
    <SingleColumnSection className={classes.root}>
      <SectionTitle title="Search synonyms" />
      <p>
        Synonyms should be formatted as a comma-separated list of values which will be
        considered as equivalent terms when performing a search. For instance, if you
        create the synonym "cat,lion,tiger" then a serach for "cat" will also match all
        documents containing the words "lion" or "tiger". Synonyms work better when
        each option is only a single word, but multiple-word synonyms are also possible.
      </p>
      {isLoading && <Loading />}
      {error && <p>{error}</p>}
      {!isLoading && !error &&
        <>
          {synonyms.map((synonym: string, i: number) =>
            <TextField
              key={i}
              value={synonym}
              onChange={onEditSynonym(i)}
              variant="standard"
              fullWidth
            />
          )}
          <div className={classes.buttons}>
            <Button variant="outlined" onClick={onAddSynonym}>Add synonym</Button>
            <Button variant="contained" onClick={onSave}>Save</Button>
          </div>
        </>
      }
    </SingleColumnSection>
  );
}

const AdminSynonymsPageComponent = registerComponent(
  "AdminSynonymsPage",
  AdminSynonymsPage,
  {styles},
);

declare global {
  interface ComponentTypes {
    AdminSynonymsPage: typeof AdminSynonymsPageComponent
  }
}
