import * as React from 'react';
import * as RNFS from 'react-native-fs';

import Styled from 'styled-components/native';

interface IStyled {
  isTitle?: boolean;
}
const Container = Styled.View`
  flex: 1;
  flex-direction: row;
  padding: 16px;
  border-bottom-width: 1px;
  border-color: lightgray;
`;

const InfoContainer = Styled.View`
    flex: 1;
    flex-direction: column;
`;
const InfoItem = Styled.Text`
    ${(props: IStyled) =>
      props.isTitle
        ? `
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 16px;
    `
        : ''}
`;
const DateContainer = Styled.View`
    flex: 1;
    flex-direction: column;
`;
const DateItem = Styled.Text``;

interface Props {
  file: RNFS.ReadDirItem;
}
interface State {}
export default class FileItem extends React.Component<Props, State> {
  render() {
    const { file } = this.props;
    const { ctime, mtime, name, size } = file;

    return (
      <Container>
        <InfoContainer>
          <InfoItem isTitle={true}>{name}</InfoItem>
          <InfoItem>
            filesize: {this._getFileSize(Number.parseInt(size))}
          </InfoItem>
        </InfoContainer>
        <DateContainer>
          {ctime && (
            <>
              <DateItem>created</DateItem>
              <DateItem>{this._getDateWithFormat(ctime)}</DateItem>
            </>
          )}
          {mtime && (
            <>
              <DateItem>modified</DateItem>
              <DateItem>{this._getDateWithFormat(mtime)}</DateItem>
            </>
          )}
        </DateContainer>
      </Container>
    );
  }

  private _getFileSize = (byte: number): string => {
    const standard = 1024;
    let unit = 0;
    while (byte >= standard || -byte >= standard) {
      byte /= standard;
      unit++;
    }
    return (unit ? byte.toFixed(1) + ' ' : byte) + ' KMGTPEZY'[unit] + 'B';
  };

  private _getDateWithFormat = (mtime: Date): string => {
    return `${mtime.getFullYear()}/${this._addZeroDateFormat(
      mtime.getMonth() + 1
    )}/${this._addZeroDateFormat(mtime.getDate())} ${this._addZeroDateFormat(
      mtime.getHours()
    )}:${this._addZeroDateFormat(mtime.getMinutes())}:${this._addZeroDateFormat(
      mtime.getSeconds()
    )}`;
  };

  private _addZeroDateFormat = (date: number): string => {
    const format = '0' + date;
    return format.slice(-2);
  };
}
