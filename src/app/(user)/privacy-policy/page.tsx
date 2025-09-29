import React from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container fixed>
      <Box sx={{ py: { xs: 3, md: 6 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          BUSINESS PRIVACY POLICY
        </Typography>

        <Typography paragraph>
          This privacy policy speaks out how E Zone Computer Trading uses and protects any information that you give us
          when you access this website. E Zone is committed to confirming that your privacy is protected. If we ask you
          to provide certain information by which you can be identified when using this website, you can be assured that
          it will only be used in accordance with this privacy statement. E Zone may change this policy from time to
          time by updating this page. You should check this page for every often to ensure that you are satisfied with
          any changes. This policy is effective from 01-01-2021
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom>
          WHAT INFORMATION WE GATHER
        </Typography>

        <Typography paragraph>We may ask for and collect the following information from you:</Typography>

        <List>
          <ListItem>
            <ListItemText primary="Name and designation" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Contact information, including email address" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Demographic information such as PIN/ZIP code, preferences and interests" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Other information pertinent to customer surveys and/or offers" />
          </ListItem>
        </List>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
          WHAT WE WILL DO WITH THE INFORMATION WE GATHER
        </Typography>

        <Typography paragraph>
          We require this information to better understand your needs so that we may provide you with superior service
          and, in particular, for the following reasons:
        </Typography>

        <List>
          <ListItem>
            <ListItemText primary="Keeping your record Internally." />
          </ListItem>
          <ListItem>
            <ListItemText primary="We may use the information to improve our products and services." />
          </ListItem>
          <ListItem>
            <ListItemText primary="We may occasionally send promotional emails, using the email address which you have provided, to inform you about new products, special offers or other information which we think you may find exciting." />
          </ListItem>
          <ListItem>
            <ListItemText primary="From time to time, we may also use your information to contact you for the purpose of market research. We may contact you by email, phone, fax or mail. We may use the information to customize the website according to your interests." />
          </ListItem>
        </List>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
          SECURITY
        </Typography>

        <Typography paragraph>
          We are committed to ensuring that your information is secure. In order to prevent unauthorized access or
          disclosure, we have executed suitable physical, electronic and administrative procedures to safeguard and
          secure the information we collect online.
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
          HOW WE HANDLE COOKIES
        </Typography>

        <Typography paragraph>
          A cookie is a small file which asks permission to be placed on your computer’s hard drive. Once you agree, the
          file is added and the cookie helps analyze web traffic and lets you know when you visit a particular site.
          Cookies allow web applications to respond to you as an individual. The web application can tailor its
          operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
          We use traffic log cookies to identify which pages are being used. This helps us analyze data about web page
          traffic and improve our website in order to tailor it to customer needs. We only use this information for
          statistical analysis purposes and then the data is removed from the system. In general, cookies help us
          provide you with an enhanced website by enabling us to monitor those pages you find useful and those you do
          not. A cookie in no way gives us access to your computer or any of your personal information other than the
          data you choose to share with us. You can choose to accept or decline cookies. Most web browsers automatically
          accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. Declining
          cookies, however, may prevent you from taking full advantage of the website.
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
          LINKS TO OTHER WEBSITES
        </Typography>

        <Typography paragraph>
          Our website may contain links to other websites of attractions. However, once you have used these links to
          leave our website, you should be aware that we do not have any control over the other websites you visit via
          those links. Therefore, we cannot be responsible for the protection and privacy of any information that you
          provide while visiting such sites and such sites are not governed by this privacy statement. You should
          exercise caution and pay close attention to the privacy statement applicable to the website in question.
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
          CONTROLLING YOUR PERSONAL INFORMATION
        </Typography>

        <Typography paragraph>
          You may opt to restrict the collection or use of your personal information in the following ways:
        </Typography>

        <List>
          <ListItem>
            <ListItemText primary="Whenever you are asked to complete a form on the website, look for the box that you can click on to indicate that you do not want the information to be used by anybody for direct marketing purposes." />
          </ListItem>
          <ListItem>
            <ListItemText primary="If you have previously agreed to allow us to use your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us. We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting, but will only do so if you give us permission." />
          </ListItem>
          <ListItem>
            <ListItemText primary="If you believe that any information, we are holding on you is incorrect or incomplete, please write to or email us as soon as possible. We will promptly correct any information found to be incorrect." />
          </ListItem>
        </List>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
