import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as yup from 'yup';
import SubmitBtn from '@components/form/SubmitBtn';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';
import CircleUi from '@ui/CircleUi';
import AuthFormContainer from '@components/AuthFormContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamList} from 'src/@types/navigation';
import {FormikHelpers} from 'formik';
import client from 'src/api/client';

const signupSchema = yup.object({
  name: yup
    .string()
    .trim('Nie podano imienia')
    .min(3, 'Zbyt krótkie imię')
    .required('Wymagane imię użytkownika'),
  email: yup
    .string()
    .trim('Brakuje adresu email')
    .email('Nieprawidłowy adres email')
    .required('Wymagany adres e-mail'),
  password: yup
    .string()
    .trim('Nie podano hasła')
    .min(8, 'Hasło jest zbyt krótkie')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      'Hasło musi zawierać przynajmniej jedną literę, cyfrę i znak specjalny',
    )
    .required('Nie podano hasła'),
});

interface Props {}

interface NewUser {
  name: string;
  email: string;
  password: string;
}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  const handleSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>,
  ) => {
    actions.setSubmitting(true);
    try {
      // we want to send these information to our api
      const {data} = await client.post('/auth/create', {
        ...values,
      });

      navigation.navigate('Verification', {userInfo: data.user});
    } catch (error) {
      console.log('Sign up error: ', error);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signupSchema}>
      <AuthFormContainer
        heading="Witamy w PetLink!"
        subHeading="Załóż konto całkowicie za darmo.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            placeholder="Np. Tomek"
            label="Imię"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="email"
            placeholder="tomasz@nowak.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            placeholder="********"
            label="Hasło"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            containerStyle={styles.marginBottom}
            rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={togglePasswordView}
          />
          <SubmitBtn title="Rejestracja" />

          <View style={styles.linkContainer}>
            <AppLink
              title="Nie pamiętam hasła"
              onPress={() => {
                navigation.navigate('LostPassword');
              }}
            />
            <AppLink
              title="Logowanie"
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default SignUp;
