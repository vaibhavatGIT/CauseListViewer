import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import cheerio from 'cheerio-without-node-native';

class Root extends Component {
    constructor(props) {
        super(props);
        //this.loadGraphicCards();
        this.state = {
            path: '',
            error: false
        }

    }
    componentDidMount = () => {
        fetch('http://upic.gov.in/DynamicPages/WeeklyCauseList.aspx', {
            method: 'GET'
        })
            .then((response) => response.text())
            .then((html) => {
                const $ = cheerio.load(html);

                const data = $("#ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_myIframe");
                this.setState({
                    path: data[0].attribs.src
                })
                //console.log("VAV", data[0].attribs.src);
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    error: true
                })
            });
    }


    render() {
        const source = { uri: this.state.path, cache: true };
        return (
            <View style={styles.container}>

                <Text>Developed and Maintained by: <Text style={{
                    color: '#1182B4'
                }}>Vaibhav.co</Text></Text>

                {!this.state.error && <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages, filePath) => {
                        // console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        // console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    style={styles.pdf} />
                }
                {
                    this.state.error &&
                    <Text style={{
                        welcome: {
                            fontSize: 20,
                            textAlign: 'center',
                            margin: 10,
                            color: '#000'
                        }
                    }}> Error While Parsing PDF </Text>
                }
            </View>
        );
    }
}

export default Root;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
    }
});
