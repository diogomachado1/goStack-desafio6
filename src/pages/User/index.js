import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 0,
    getAll: false,
    refreshing: false,
  };

  async componentDidMount() {
    this.loadMore();
  }

  refreshList = async () => {
    const { refreshing } = this.state;

    if (refreshing === false) {
      const { navigation } = this.props;

      this.setState({ refreshing: true });
      const user = navigation.getParam('user');

      const response = await api.get(`/users/${user.login}/starred?page=${1}`);
      this.setState({
        stars: response.data,
        refreshing: false,
        page: 1,
        getAll: false,
      });
    }
  };

  loadMore = async () => {
    const { stars, page, getAll, loading } = this.state;

    if (!getAll && loading === false) {
      const { navigation } = this.props;

      this.setState({ loading: true });
      const user = navigation.getParam('user');

      const response = await api.get(
        `/users/${user.login}/starred?page=${page + 1}`,
      );
      if (response.data.length > 0) {
        this.setState({
          stars: [...stars, ...response.data],
          loading: false,
          page: page + 1,
        });
      } else {
        this.setState({
          loading: false,
          getAll: true,
        });
      }
    }
  };

  handleNavigate = starred => {
    const { navigation } = this.props;

    navigation.navigate('GithubPage', { starred });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          data={stars}
          onRefresh={this.refreshList}
          refreshing={refreshing}
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          ListFooterComponent={() => (loading ? <ActivityIndicator /> : null)}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred onPress={() => this.handleNavigate(item)}>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      </Container>
    );
  }
}
