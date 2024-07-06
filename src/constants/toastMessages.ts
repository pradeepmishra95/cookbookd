const toastMessages: Record<
  string,
  Record<
    string,
    {
      message: string;
      description: string;
      type: 'success' | 'error';
    }
  >
> = {
  oauth: {
    error: {
      message: 'Ops! An Error has occurred!',
      description:
        'An unknown error has occured in opening OAuth, please use a different method for authentication',
      type: 'error',
    },
  },
  forgot_password: {
    success: {
      message: 'Password Reset Successful',
      description: 'Your password have been reset successfully',
      type: 'success',
    },
  },
  otp: {
    success: {
      message: 'OTP Successfully Sent',
      description:
        'An OTP has been sent successfully on your registered details',
      type: 'success',
    },
    incomplete: {
      message: 'Incomplete OTP',
      description: 'Please fill the OTP',
      type: 'error',
    },
  },
  change_password: {
    success: {
      message: 'Password Change Successful',
      description: 'Your password have been changed successfully',
      type: 'success',
    },
  },
  add_password: {
    success: {
      message: 'Password Added Successful',
      description: 'Your password have been added successfully',
      type: 'success',
    },
  },
  delete_menu: {
    success: {
      message: 'Menu Delete Successful',
      description: 'The menu has been deleted successfully',
      type: 'success',
    },
  },
  images_required: {
    error: {
      message: 'Validation Error',
      description: 'Please select atleast one image',
      type: 'error',
    },
  },

  delete_address: {
    success: {
      message: 'Address Delete Successful',
      description: 'The address has been deleted successfully',
      type: 'success',
    },
  },
  support_center: {
    success: {
      message: 'Feedback Successful',
      description: 'The feedback has been sent successfully',
      type: 'success',
    },
  },
  report: {
    post: {
      message: 'Report Successful',
      description: 'The post has been successfully reported',
      type: 'success',
    },
    live_stream: {
      message: 'Report Successful',
      description: 'The live stream has been successfully reported',
      type: 'success',
    },
  },
};

export default toastMessages;
