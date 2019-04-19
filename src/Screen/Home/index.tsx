import * as React from 'react';
import { Platform, AppState } from 'react-native';
import { Button, Icon } from 'native-base';
import Styled from 'styled-components/native';
import { NavigationState, NavigationScreenProp } from 'react-navigation';
import * as RNFS from 'react-native-fs';
import { FlatList } from 'react-native-gesture-handler';

import FileItem from './FileItem';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}
interface State {
  files: Array<RNFS.ReadDirItem>;
}

const Container = Styled.SafeAreaView`
  flex: 1;
`;

export default class Home extends React.Component<Props, State> {
  private _DOCUMENT_PATH = RNFS.DocumentDirectoryPath;

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'File Viewer',
      headerRight: (
        <Button
          transparent={true}
          light={true}
          onPress={navigation.getParam('loadFile')}>
          <Icon
            type="MaterialCommunityIcons"
            style={{ color: 'black' }}
            name="refresh"
          />
        </Button>
      ),
    };
  };

  constructor(props: Props) {
    super(props);

    this.props.navigation.setParams({ loadFile: this._loadFiles });

    this.state = {
      files: [],
    };
  }

  render() {
    const { files } = this.state;
    return (
      <Container>
        {files.length > 0 && (
          <FlatList
            data={files}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index }) => <FileItem file={item} />}
          />
        )}
      </Container>
    );
  }

  componentDidMount() {
    this._loadFiles();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  private _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this._loadFiles();
    }
  };

  private _loadFiles = async () => {
    if (Platform.OS === 'ios') {
      await this._moveInboxFiles();
    }

    RNFS.readDir(this._DOCUMENT_PATH)
      .then((srcFiles: Array<RNFS.ReadDirItem>) => {
        let files: Array<RNFS.ReadDirItem> = [];
        srcFiles.map((file: RNFS.ReadDirItem) => {
          console.log(file);
          if (file.isFile() && file.name.indexOf('.temp') >= 0) {
            files.push(file);
          }
        });
        this.setState({ files });
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  };

  private _moveInboxFiles = async () => {
    try {
      const inboxFiles = await RNFS.readDir(this._DOCUMENT_PATH + '/Inbox');
      if (inboxFiles) {
        inboxFiles.map(async file => {
          if (file.isFile()) {
            if (file.isFile()) {
              await RNFS.moveFile(
                file.path,
                `${this._DOCUMENT_PATH}/${file.name}`
              );
            }
          }
        });
      }
    } catch (err) {
      console.log(err.message, err.code);
    }
  };
}
