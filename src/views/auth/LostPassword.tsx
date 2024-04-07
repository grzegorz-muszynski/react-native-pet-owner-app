import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import SubmitBtn from '@components/form/SubmitBtn';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamList} from 'src/@types/navigation';
import {FormikHelpers} from 'formik';
import client from 'src/api/client';

const lostPasswordSchema = yup.object({
  email: yup
    .string()
    .trim('Nie podano adresu e-mail')
    .email('E-mail nieprawidłowy')
    .required('Nie podano adresu e-mail'),
});

interface Props {}

interface InitialValue {
  email: string;
}

const initialValues = {
  email: '',
};

const handleSubmit = async (
  values: InitialValue,
  actions: FormikHelpers<InitialValue>,
) => {
  actions.setSubmitting(true);
  try {
    // we want to send these information to our api
    const {data} = await client.post('/auth/forget-password', {
      ...values,
    });

    console.log(data);
  } catch (error) {
    console.log('Lost Password error: ', error);
  }

  actions.setSubmitting(false);
};

const LostPassword: FC<Props> = props => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={lostPasswordSchema}>
      <AuthFormContainer
        heading="Odzyskiwanie hasła"
        subHeading="Jeżeli nie pamiętasz hasła - nie martw się, pomożemy je odzyskać.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />

          <SubmitBtn title="Wyślij link" />

          <View style={styles.linkContainer}>
            <AppLink
              title="Logowanie"
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            />
            <AppLink
              title="Rejestracja"
              onPress={() => {
                navigation.navigate('SignUp');
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

export default LostPassword;
