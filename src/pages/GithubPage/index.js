import React from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

// import { Container } from './styles';

export default function GithubPage({ navigation }) {
  return <WebView source={{ uri: navigation.getParam('starred').html_url }} />;
}

GithubPage.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

GithubPage.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('starred').name,
});
