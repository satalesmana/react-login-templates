import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ButtonType = 'Primary' | 'Secondary'

interface MyButtonInterface {
    btnType: ButtonType;
    text: String;
    action: ()=>void
}

export default function myButton({
    btnType,
    text,
    action
}:MyButtonInterface){
    const buttonStyle = ()=>{
        if(btnType==='Primary'){
            return styles.buttonPrimary
        }
        return styles.buttonSecondary
    }

    const buttonTextStyle = ()=>{
        if(btnType==='Primary'){
            return styles.buttonTextPrimary
        }
        return styles.buttonTextSecondary
    }

    return(
        <TouchableOpacity 
            style={[styles.button, buttonStyle()]}
            onPress={action}>
            <Text style={[styles.buttonText, buttonTextStyle()]}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        height:60,
        borderRadius: 10,
        display: 'flex',
        justifyContent:'center',
        flex: 1,
    },
    buttonText:{
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 600
    },
    buttonPrimary:{
        backgroundColor: '#1F41BB'
    },
    buttonTextPrimary:{
        color: '#FFFFFF',
    },
    buttonSecondary:{
        backgroundColor: '#FFFFFF'
    },
    buttonTextSecondary:{
        color: '#0A0A0A'
    }
})
