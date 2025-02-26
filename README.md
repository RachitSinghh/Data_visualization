
## Features

1. Data Visualization
   - Intensity by Region chart
   - Likelihood by Year chart

2. Interactive Filters
   - PEST
   - Source
   - Country
   - City
   - End Year
   - Topic
   - Sector
   - Region

3. Real-time Updates
   - Charts update automatically when filters are applied
   - Reset functionality to clear all filters

## Troubleshooting

1. MongoDB Connection Issues
   - Verify MongoDB is running: `sudo systemctl status mongod`
   - Check MongoDB connection string in config.py
   - Ensure MongoDB port (27017) is not blocked

2. Data Loading Issues
   - Verify jsondata.json exists in root directory
   - Check JSON file format is valid
   - Check MongoDB database permissions

3. Port Issues
   - If port 5001 is in use, modify the port in run.py
   - Check if firewall is blocking the port

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- D3.js for visualization
- Flask for web framework
- MongoDB for database
- Bootstrap for styling
