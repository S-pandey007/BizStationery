import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5F5F5' // Light gray background for the container
    backgroundColor: '#fff', // Light gray background for the container
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Ensures the header stays above the ScrollView
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#6B48FF',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#6B48FF',
    padding: 8,
    borderRadius: 12,
    elevation: 2,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 120, // Space for the fixed header
    marginBottom: 40, // Added bottom margin for consistency
  },
  contentContainer: {
    paddingBottom: 20,
    paddingHorizontal: 15, // Added horizontal padding for consistency
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  editSectionButton: {
    backgroundColor: '#4CAF50', // Green for edit buttons, matching the screenshot
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  editSectionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 15,
  },
  verified: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  socialIcons: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'flex-start',
  },
  socialIcon: {
    marginRight: 15,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  statItem: {
    width: width / 2 - 20, // 2 items per row for clarity
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
});

export default styles;