TEAMWORK.TableData=function(settings) {

	var self=this;

	this.title="Test Table";
	this.URL='data.json';
	this.items=ko.observableArray([]);

	/* Table data item */
	this.Item=function(data) {
	
		data.range=data.range.join(',');
		data.tags=data.tags.join(',');
		data.name=data.name.first+' '+data.name.last;
		
		for (var i=0, ii=data.friends.length;i<ii;i++) {
			data.friends[i]=data.friends[i].id+':'+data.friends[i].name;
		}
		data.friends=data.friends.join(',');

		data.show=ko.observable(true);
		return data;
	
	};
	
	this.fields=ko.observableArray([]);

	/* Field heading item */
	this.FieldName=function(data) {
	
		data.show=ko.observable(true);
		data.csshidden=ko.pureComputed(
			function() {
				
				/*return this.show()?'':'coldimmed';*/

				if (self.selectColumns()) {
					return this.show()?'':'coldimmed';
				}
				else {
					return this.show()?'':'colhidden';
				}
			},
			data
		);
		return data;
    
	};

	this.selectColumns=ko.observable(false);
	
	this.get=function() {

		$.ajax(
			{
				url: self.URL,
				dataType:'json'
			}
		).done(
			function(response) {

				self.getHeadings(response[0]);

				for (var i=0, ii=response.length;i<ii;i++) {
					self.items.push(new self.Item(response[i]));
				}
							
			}
		).fail(
			function (jqXHR, textStatus) {
		
				alert('There was a problem getting the table data');
		
			}
		);

	};

	/* Create an array of column headings */
	this.getHeadings=function(item) {

		for (key in item) {
			self.fields.push(new self.FieldName({key:key}));
			self.fieldsSearch+=key+';';
		};

	};

	/* Sorting */
	this.sortKey=ko.observable('index');
	this.sortOrder=1;
	
	this.sortColumn=function(heading) {
	
		if (heading.key==self.sortKey()) {
			self.sortOrder*=-1;
		}
		else {
			self.sortKey(heading.key);
			self.sortOrder=1;
		}
		self.items.sort(self.sortByKey);
	
	};

	this.sortByKey=function(a, b) {
		
		a=ko.unwrap(a[self.sortKey()]);
		b=ko.unwrap(b[self.sortKey()]);
		
		return a == b ? 0 : (a < b ? -1*self.sortOrder : 1*self.sortOrder);
	};
	
	/* Filtering */
	this.fieldsSearch=';';
	this.filterValue=ko.observable('').extend({ throttle: 400 });

	this.filterData=function() {
	
		var items, 
			key, 
			found,
			index,
			filterValue=self.filterValue().toLowerCase(),
			filterValueParsed=filterValue.split(':'), 
			fullSearch=true;

		/* if the search is part of a fieldname then don't search at all */
		if (filterValue.length) {
			if (filterValueParsed.length==1 && self.fieldsSearch.toLowerCase().indexOf(';'+filterValueParsed)!=-1) {
				fullSearch=false;
				console.log('no search:'+filterValue);
			}
			/* check to see if the search value is prefixed with a fieldname followed by a : */
			else {
				index=self.fieldsSearch.toLowerCase().indexOf(';'+filterValueParsed[0]+';');
				if (filterValueParsed.length>1 && index!=-1) {
					key=filterValueParsed[0];
					key=self.fieldsSearch.substr(index+1, filterValueParsed[0].length);
					filterValue=filterValue.substr(key.length+1);
					fullSearch=false;
					console.log('single field search:'+key+','+filterValue);

					for(i=0, ii=self.items().length;i<ii;i++) {
						item=self.items()[i];
						found=(item[key].toString().toLowerCase().indexOf(filterValue)!=-1)?true:false;
						item.show(found);
					}
				}
			}
		}
		
		/* Not prefxied so do a full field search */
		if (fullSearch) {
			console.log('full search:'+filterValue);
		
			for(i=0, ii=self.items().length;i<ii;i++) {
				item=self.items()[i];
				found=false;
				
				for(j=0, jj=self.fields().length;j<jj;j++) {
				
					key=self.fields()[j].key;
					if (item[key].toString().toLowerCase().indexOf(filterValue)!=-1) {
						found=true;
						break;
					};
				
				}
				item.show(found);
			}
		}
	};
	
	this.filterValue.subscribe(
		this.filterData
	);
	
	this.get();
	
	return this;

};
